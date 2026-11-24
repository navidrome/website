#!/usr/bin/env node
// Screenshots and screen recordings for a release post, taken from the PRs that the release
// notes link to. Needs ffmpeg and ffprobe.
//
// Usage:
//   node release-post/media.mjs collect <release.json> <bundle-dir>
//     Downloads the media of the linked PRs into <bundle-dir>/media/, makes them small, and
//     writes <bundle-dir>/media.json. The model then picks which ones the post shows.
//   node release-post/media.mjs sync <bundle-dir>
//     Keeps only the media that index.md shows. Downloads again any shown item that is neither
//     uploaded nor in media/.
//
// Local files: media/<id>.jpg for an image, media/<id>.mp4 and media/<id>-poster.jpg for a
// video. They never go in git: assets.mjs uploads them to a GitHub release and writes their
// URLs in media.json ("files"), and layouts/shortcodes/release-media.html shows them from there.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { RELEASE_ASSET_URL, env, mediaRefs } from "./lib.mjs";

const SOURCE_REPO = "navidrome/navidrome";
export const MEDIA_DIR = "media";
const MAX_ITEMS = 16; // Items offered to the model.
const MAX_PER_PR = 3;
const MAX_DOWNLOAD = 200 * 1024 * 1024;
const MAX_FILE = 20 * 1024 * 1024; // Cloudflare Pages rejects files over 25 MiB.
const MAX_VIDEO_SECONDS = 180;
// The longest side, in pixels. Phone screenshots and recordings are tall.
const IMAGE_SIZE = 1600;
const VIDEO_SIZE = 1280;

// An ffmpeg scale filter that fits the picture in a size x size box, never larger, with even
// sides (H.264 needs them).
function fit(size) {
  const k = `min(1,min(${size}/iw,${size}/ih))`;
  return `scale='trunc(iw*${k}/2)*2':'trunc(ih*${k}/2)*2'`;
}

// Only files that GitHub hosts for issues and PRs. Other URLs in a PR body can be anything.
const ASSET = String.raw`https://(?:github\.com/user-attachments/assets/[0-9a-f-]{36}|github\.com/navidrome/navidrome/assets/\d+/[0-9a-f-]{36}|user-images\.githubusercontent\.com/\d+/[\w.-]+)`;

// PR numbers in the order the release notes link to them.
export function prLinks(notes) {
  const re = new RegExp(String.raw`https://github\.com/${SOURCE_REPO}/pull/(\d+)`, "g");
  return [...new Set([...String(notes).matchAll(re)].map((m) => Number(m[1])))];
}

function plain(text) {
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/[^\s)]+/g, " ")
    .replace(/\(\s*\)/g, " ")
    .replace(/[`*_#<>[\]!{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

// Media in a PR body: GitHub-hosted URLs in an <img> or <video>, a Markdown image, or alone on
// a line (GitHub shows a bare video URL as a player). Each item gets the alt text, if any, and
// the text line before it, so the model knows what it shows ("Before:", "After:").
export function mediaInBody(body) {
  const items = [];
  const seen = new Set();
  let context = "";
  const add = (url, alt) => {
    if (seen.has(url)) return;
    seen.add(url);
    items.push({ url, alt: plain(alt ?? ""), context });
  };
  const html = new RegExp(String.raw`<(?:img|video|source)\b[^>]*?\bsrc=["'](${ASSET})["'][^>]*>`, "gi");
  const md = new RegExp(String.raw`!\[([^\]\n]*)\]\((${ASSET})\)`, "g");
  const bare = new RegExp(String.raw`^\s*(${ASSET})\s*$`);
  for (const line of String(body ?? "").replace(/\r\n/g, "\n").split("\n")) {
    let found = false;
    for (const m of line.matchAll(html)) {
      add(m[1], /\balt=["']([^"']*)["']/i.exec(m[0])?.[1]);
      found = true;
    }
    for (const m of line.matchAll(md)) {
      add(m[2], m[1]);
      found = true;
    }
    const b = bare.exec(line);
    if (b) {
      add(b[1], "");
      found = true;
    }
    // A table border line ("| :---: |") is not text.
    if (!found && plain(line) && !/^[\s|:-]+$/.test(line)) context = plain(line);
  }
  return items;
}

// UI features first, then UI fixes, then the rest, each in release-notes order.
function rank(title) {
  if (/^feat(\(ui\))?!?:/i.test(title)) return /^feat\(ui\)/i.test(title) ? 0 : 1;
  if (/^fix\(ui\)/i.test(title)) return 2;
  return 3;
}

function run(cmd, args) {
  return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
}

// The width and height of a picture or video, for the page layout.
export function probeSize(file) {
  const out = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", file]);
  const s = JSON.parse(out.toString()).streams?.[0];
  if (!s?.width || !s?.height) throw new Error(`no picture in ${path.basename(file)}`);
  return { width: s.width, height: s.height };
}

// Counting frames decodes the whole file, so it is done only for GIF and APNG.
function probe(file) {
  const read = (extra) =>
    JSON.parse(
      run("ffprobe", [
        "-v", "error", ...extra, "-select_streams", "v:0",
        "-show_entries", "stream=codec_name,width,height,nb_frames,nb_read_frames:format=duration",
        "-of", "json", file,
      ]).toString(),
    );
  let json = read([]);
  let s = json.streams?.[0];
  if (!s) throw new Error("no picture in the file");
  if (s.codec_name === "gif" || s.codec_name === "apng") {
    json = read(["-count_frames"]);
    s = json.streams[0];
  }
  const still = ["png", "mjpeg", "webp", "bmp", "tiff"].includes(s.codec_name);
  const frames = Number(s.nb_read_frames || s.nb_frames) || (still ? 1 : 2);
  return { codec: s.codec_name, frames: still ? 1 : frames, duration: Number(json.format?.duration) || 0 };
}

function encodeVideo(src, out, size, crf) {
  run("ffmpeg", [
    "-v", "error", "-y", "-i", src,
    "-vf", `${fit(size)},fps=30`,
    "-c:v", "libx264", "-preset", "medium", "-crf", String(crf), "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out,
  ]);
}

// Turns a downloaded file into media/<id>.jpg, or media/<id>.mp4 and its poster.
// Returns "image" or "video". Throws when the file is not a picture or a short video.
export function convertMedia(src, dir, id) {
  const info = probe(src);
  mkdirSync(dir, { recursive: true });
  // A GIF with one frame is a picture. An animated GIF becomes a video, which is much smaller.
  const isVideo = info.frames > 1;
  if (!isVideo) {
    const out = path.join(dir, `${id}.jpg`);
    run("ffmpeg", ["-v", "error", "-y", "-i", src, "-frames:v", "1", "-vf", fit(IMAGE_SIZE), "-q:v", "3", out]);
    if (statSync(out).size > MAX_FILE) throw new Error("the image is too big");
    return "image";
  }
  if (info.duration > MAX_VIDEO_SECONDS) throw new Error(`the video is longer than ${MAX_VIDEO_SECONDS} seconds`);
  const out = path.join(dir, `${id}.mp4`);
  encodeVideo(src, out, VIDEO_SIZE, 28);
  if (statSync(out).size > MAX_FILE) encodeVideo(src, out, 960, 34);
  if (statSync(out).size > MAX_FILE) {
    rmSync(out, { force: true });
    throw new Error("the video is too big, even made smaller");
  }
  // "thumbnail" picks a typical frame, not the often black first one.
  run("ffmpeg", ["-v", "error", "-y", "-i", out, "-vf", "thumbnail=60", "-frames:v", "1", "-q:v", "3", path.join(dir, `${id}-poster.jpg`)]);
  return "video";
}

// A small JPEG of a media item, for the model to look at.
export function previewImage(bundle, item) {
  const file = path.join(bundle, MEDIA_DIR, item.kind === "video" ? `${item.id}-poster.jpg` : `${item.id}.jpg`);
  return run("ffmpeg", ["-v", "error", "-i", file, "-frames:v", "1", "-vf", fit(768), "-f", "image2pipe", "-c:v", "mjpeg", "-q:v", "5", "-"]);
}

// The local files of an item, by role: "main" (the picture or the video) and "poster".
export function mediaFiles(id, kind) {
  return kind === "video" ? { main: `${id}.mp4`, poster: `${id}-poster.jpg` } : { main: `${id}.jpg` };
}

export function hasLocalFiles(bundle, item) {
  return Object.values(mediaFiles(item.id, item.kind)).every((f) => existsSync(path.join(bundle, MEDIA_DIR, f)));
}

// True when every file of the item is uploaded, with a URL and a size.
export function isUploaded(item) {
  return Object.keys(mediaFiles(item.id, item.kind)).every((role) => {
    const f = item.files?.[role];
    return Boolean(f && RELEASE_ASSET_URL.test(f.url) && Number.isInteger(f.width) && Number.isInteger(f.height));
  });
}

// The ids name files, and the URLs are downloaded again by sync or put on the page, so all of
// them are checked. An item with bad "files" loses them, so it is not shown until uploaded again.
export function readMedia(bundle) {
  const file = path.join(bundle, "media.json");
  if (!existsSync(file)) return null;
  const asset = new RegExp(`^${ASSET}$`);
  return (JSON.parse(readFileSync(file, "utf8")).items ?? [])
    .filter((i) => /^[a-z0-9-]{1,40}$/.test(i.id) && (i.kind === "image" || i.kind === "video") && asset.test(i.url))
    .map((i) => {
      if (!i.files || isUploaded(i)) return i;
      const { files, ...rest } = i;
      return rest;
    });
}

export function writeMedia(bundle, items) {
  writeFileSync(path.join(bundle, "media.json"), `${JSON.stringify({ source: SOURCE_REPO, items }, null, 2)}\n`);
}

// The ids that the post can show: uploaded ones, and with local: true also the ones in media/.
// null when there is no media.json.
export function mediaWithFiles(bundle, { local = true } = {}) {
  const items = readMedia(bundle);
  if (!items) return null;
  return new Set(items.filter((i) => isUploaded(i) || (local && hasLocalFiles(bundle, i))).map((i) => i.id));
}

async function download(url, file) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`download returned ${res.status}`);
  if (Number(res.headers.get("content-length")) > MAX_DOWNLOAD) throw new Error("the file is too big to download");
  const type = res.headers.get("content-type") ?? "";
  if (!/^(image|video)\//.test(type)) throw new Error(`not an image or a video (${type || "no type"})`);
  const chunks = [];
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.length;
    if (size > MAX_DOWNLOAD) throw new Error("the file is too big to download");
    chunks.push(chunk);
  }
  writeFileSync(file, Buffer.concat(chunks));
}

// Downloads and converts one item. Returns its kind.
async function fetchItem(item, mediaDir, downloader) {
  const tmp = mkdtempSync(path.join(tmpdir(), "release-media-"));
  try {
    const src = path.join(tmp, "source");
    await downloader(item.url, src);
    return convertMedia(src, mediaDir, item.id);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function githubPr(number) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const api = env("GITHUB_API_URL", "https://api.github.com");
  const res = await fetch(`${api}/repos/${SOURCE_REPO}/pulls/${number}`, {
    headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status} for PR #${number}`);
  const pr = await res.json();
  return { title: pr.title ?? "", body: pr.body ?? "" };
}

// Collects the media of the given PRs into bundle/media/ and writes bundle/media.json.
// One item that fails is skipped with a warning. fetchPr and downloader are for tests.
export async function collectMedia({ prs, bundle, fetchPr = githubPr, downloader = download, log = console.warn }) {
  const candidates = [];
  const queue = [...prs];
  // A few PRs at a time: a release can link to a hundred of them.
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const number = queue.shift();
        try {
          const pr = await fetchPr(number);
          mediaInBody(pr.body)
            .slice(0, MAX_PER_PR)
            .forEach((m, i) =>
              candidates.push({ id: `pr${number}-${i + 1}`, pr: number, pr_title: plain(pr.title), rank: rank(pr.title), order: prs.indexOf(number), ...m }),
            );
        } catch (e) {
          log(`PR #${number}: ${e.message}`);
        }
      }
    }),
  );
  candidates.sort((a, b) => a.rank - b.rank || a.order - b.order || a.id.localeCompare(b.id, "en", { numeric: true }));

  const mediaDir = path.join(bundle, MEDIA_DIR);
  const items = [];
  for (const c of candidates) {
    if (items.length >= MAX_ITEMS) break;
    try {
      const kind = await fetchItem(c, mediaDir, downloader);
      const { order, rank: _, ...item } = c;
      items.push({ ...item, kind });
    } catch (e) {
      log(`${c.id} (${c.url}): ${e.message}`);
    }
  }
  mkdirSync(bundle, { recursive: true });
  writeMedia(bundle, items);
  console.log(`Collected ${items.length} media items from ${prs.length} PRs.`);
  return items;
}

// Keeps only the media that index.md shows. A shown item that is neither uploaded nor in media/
// is downloaded again. An item that is not shown loses its local files and its uploaded URLs;
// assets.mjs then deletes those uploads. Without media.json, the media folder goes away.
export async function syncMedia(bundle, { downloader = download } = {}) {
  const mediaDir = path.join(bundle, MEDIA_DIR);
  const items = readMedia(bundle);
  const body = readFileSync(path.join(bundle, "index.md"), "utf8");
  const shown = new Set(mediaRefs(body).refs.map((r) => r.id));
  const keep = new Set();
  const next = [];
  for (const item of items ?? []) {
    if (!shown.has(item.id)) {
      const { files, ...rest } = item;
      next.push(rest);
      continue;
    }
    next.push(item);
    if (isUploaded(item)) continue;
    if (!hasLocalFiles(bundle, item)) {
      console.log(`Downloading ${item.id} again.`);
      await fetchItem(item, mediaDir, downloader);
    }
    Object.values(mediaFiles(item.id, item.kind)).forEach((f) => keep.add(f));
  }
  if (items) writeMedia(bundle, next);
  if (!existsSync(mediaDir)) return;
  for (const f of readdirSync(mediaDir)) if (!keep.has(f)) rmSync(path.join(mediaDir, f), { recursive: true, force: true });
  if (!readdirSync(mediaDir).length) rmSync(mediaDir, { recursive: true, force: true });
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "collect" && args.length === 2) {
    const release = JSON.parse(readFileSync(args[0], "utf8"));
    await collectMedia({ prs: prLinks(release.body), bundle: args[1] });
  } else if (command === "sync" && args.length === 1) {
    await syncMedia(args[0]);
  } else {
    throw new Error("Usage: media.mjs collect <release.json> <bundle-dir> | media.mjs sync <bundle-dir>");
  }
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
