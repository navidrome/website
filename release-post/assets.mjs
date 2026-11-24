#!/usr/bin/env node
// Uploads the audio and media of a release post to a GitHub release of this repo, so big files
// never go in git. Writes their URLs in audio.json ("url") and media.json ("files"), deletes the
// local files, and deletes uploads that the post no longer uses.
//
// Usage: node release-post/assets.mjs publish <bundle-dir>
// Needs the gh CLI, GH_TOKEN (contents: write) and GITHUB_REPOSITORY (owner/repo).
//
// Each post has its own pre-release, "blog-media-<tag>". File names end with a hash of their
// content: GitHub caches a "not found" answer for a while, so a URL is never reused for a
// different file.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { RELEASE_ASSET_URL, env, mediaRefs, mediaReleaseTag, parseTag } from "./lib.mjs";
import { MEDIA_DIR, hasLocalFiles, isUploaded, mediaFiles, mediaWithFiles, probeSize, readMedia, writeMedia } from "./media.mjs";

export function hashedName(file, stem) {
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
  return `${stem}-${hash}${path.extname(file)}`;
}

function ghCli(args) {
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

// Problems that stop a post from being committed or published: local audio or media files, or
// a post that shows audio or media that is not uploaded.
export function publishProblems(bundle) {
  const problems = [];
  if (existsSync(path.join(bundle, "narration.mp3"))) problems.push("narration.mp3 is not uploaded");
  const mediaDir = path.join(bundle, MEDIA_DIR);
  if (existsSync(mediaDir) && readdirSync(mediaDir).length) problems.push(`${MEDIA_DIR}/ has files that are not uploaded`);
  const audio = readJson(path.join(bundle, "audio.json"));
  if (audio && !RELEASE_ASSET_URL.test(audio.url ?? "")) problems.push("audio.json has no uploaded audio URL");
  const uploaded = mediaWithFiles(bundle, { local: false }) ?? new Set();
  const body = readFileSync(path.join(bundle, "index.md"), "utf8");
  const missing = mediaRefs(body).refs.map((r) => r.id).filter((id) => !uploaded.has(id));
  if (missing.length) problems.push(`media shown but not uploaded: ${[...new Set(missing)].join(", ")}`);
  return problems;
}

export function publishAssets(bundle, { repo = env("GITHUB_REPOSITORY", ""), gh = ghCli, log = console.log } = {}) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error("GITHUB_REPOSITORY must be owner/repo");
  const { tag } = parseTag(path.basename(path.resolve(bundle)));
  const release = mediaReleaseTag(tag);
  const audioFile = path.join(bundle, "audio.json");
  const audio = readJson(audioFile);
  const items = readMedia(bundle);
  const localAudio = path.join(bundle, "narration.mp3");
  const toUpload = [];
  if (existsSync(localAudio)) {
    if (!audio) throw new Error("narration.mp3 has no audio.json");
    toUpload.push({ file: localAudio, name: hashedName(localAudio, "narration"), set: (url, name) => Object.assign(audio, { url, file: name }) });
  }
  for (const item of items ?? []) {
    if (isUploaded(item) || !hasLocalFiles(bundle, item)) continue;
    const files = {};
    for (const [role, local] of Object.entries(mediaFiles(item.id, item.kind))) {
      const file = path.join(bundle, MEDIA_DIR, local);
      const name = hashedName(file, path.basename(local, path.extname(local)));
      toUpload.push({ file, name, set: (url) => (files[role] = { url, name, ...probeSize(file) }) });
    }
    toUpload.push({ done: () => (item.files = files) });
  }

  const listAssets = () => JSON.parse(gh(["release", "view", release, "-R", repo, "--json", "assets"])).assets.map((a) => a.name);
  let existing;
  try {
    existing = listAssets();
  } catch {
    if (!toUpload.length) return; // No release and nothing to upload.
    log(`Creating the release ${release}.`);
    gh([
      "release", "create", release, "-R", repo, "--prerelease", "--latest=false",
      "--title", `Blog media: Navidrome ${tag}`,
      "--notes", `Audio, screenshots and videos for the Navidrome ${tag} release blog post. The post links to these files. Do not delete them.`,
    ]);
    existing = [];
  }

  const tmp = mkdtempSync(path.join(tmpdir(), "release-assets-"));
  try {
    for (const u of toUpload) {
      if (u.done) {
        u.done();
        continue;
      }
      const url = `https://github.com/${repo}/releases/download/${release}/${u.name}`;
      if (!existing.includes(u.name)) {
        const copy = path.join(tmp, u.name);
        copyFileSync(u.file, copy);
        log(`Uploading ${u.name}.`);
        gh(["release", "upload", release, "-R", repo, copy]);
      }
      u.set(url, u.name);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  if (audio) writeFileSync(audioFile, `${JSON.stringify(audio, null, 2)}\n`);
  if (items) writeMedia(bundle, items);
  for (const u of toUpload) if (u.file) rmSync(u.file, { force: true });
  const mediaDir = path.join(bundle, MEDIA_DIR);
  if (existsSync(mediaDir) && !readdirSync(mediaDir).length) rmSync(mediaDir, { recursive: true, force: true });

  // Only after the uploads: delete what the post no longer uses, such as old audio.
  const keep = new Set([audio?.file, ...(items ?? []).flatMap((i) => Object.values(i.files ?? {}).map((f) => f.name))].filter(Boolean));
  for (const name of listAssets()) {
    if (keep.has(name)) continue;
    log(`Deleting ${name}, which the post no longer uses.`);
    gh(["release", "delete-asset", release, name, "-R", repo, "--yes"]);
  }
}

async function main() {
  const [command, bundle] = process.argv.slice(2);
  if (command !== "publish" || !bundle) throw new Error("Usage: assets.mjs publish <bundle-dir>");
  publishAssets(bundle);
  const problems = publishProblems(bundle);
  if (problems.length) throw new Error(problems.join("; "));
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
