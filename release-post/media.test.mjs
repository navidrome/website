// Run with: npm run test:release-post
import assert from "node:assert/strict";
import { execFile, execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { buildRequestInput, validatePost } from "./generate-post.mjs";
import { REPO_ROOT, checkPost, dropBadMedia, linkHandles, postBody } from "./lib.mjs";
import { collectMedia, convertMedia, mediaInBody, mediaWithFiles, prLinks, readMedia, syncMedia } from "./media.mjs";

const hasFfmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
const noFfmpeg = !hasFfmpeg && "ffmpeg not installed";

const asset = (n) => `https://github.com/user-attachments/assets/${String(n).padStart(8, "0")}-0000-4000-8000-000000000000`;
const line = (id, alt = "A picture") => `{{< release-media id="${id}" alt="${alt}" >}}`;
const post = (body) => `---\ntitle: x\nbuild:\n  publishResources: false\n---\n\n{{< release-audio >}}\n\n${body}\n`;

function tmp(t, prefix) {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function ffmpeg(...args) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
}

function size(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file], { encoding: "utf8" });
  return out.trim().split(",").map(Number);
}

describe("finding media", () => {
  it("lists the linked PRs once, in order", () => {
    const notes = "A https://github.com/navidrome/navidrome/pull/12 B https://github.com/navidrome/navidrome/pull/3 C https://github.com/navidrome/navidrome/pull/12 D https://github.com/other/repo/pull/9";
    assert.deepEqual(prLinks(notes), [12, 3]);
  });

  it("takes GitHub-hosted images and videos, with their alt text and the text before them", () => {
    const body = [
      "## Before",
      `<img width="100" alt="old menu" src="${asset(1)}" />`,
      "**After:** the new menu",
      `![new menu](${asset(2)})`,
      "",
      `${asset(3)}`,
      `Again: ![dup](${asset(2)})`,
      "![elsewhere](https://example.com/x.png)",
      `See ${asset(4)} for logs`,
    ].join("\n");
    assert.deepEqual(mediaInBody(body), [
      { url: asset(1), alt: "old menu", context: "Before" },
      { url: asset(2), alt: "new menu", context: "After: the new menu" },
      { url: asset(3), alt: "", context: "After: the new menu" },
    ]);
  });
});

describe("media lines", () => {
  it("accepts only the exact form, with an id that has a file", () => {
    const ids = new Set(["pr1-1"]);
    assert.deepEqual(checkPost(post(line("pr1-1")), ids), []);
    assert.match(checkPost(post(line("pr1-1")), null).join(), /no file in media\/: pr1-1/);
    assert.match(checkPost(post(line("pr2-1")), ids).join(), /no file in media\/: pr2-1/);
    for (const bad of [
      `{{< release-media id="pr1-1" >}}`,
      `{{< release-media id="pr1-1" alt="a "quoted" word" >}}`,
      `{{< release-media id="pr1-1" alt="x" class="y" >}}`,
      `{{< release-media id="../x" alt="x" >}}`,
      `  ${line("pr1-1")}`,
      `Text then ${line("pr1-1")}`,
    ]) {
      assert.match(checkPost(post(bad), ids).join(), /wrong form/, bad);
    }
  });

  it("rejects Markdown images and other shortcodes", () => {
    assert.match(checkPost(post("![x](https://example.com/a.png)"), new Set()).join(), /Markdown image/);
    assert.match(checkPost(post("![x][ref]\n\n[ref]: https://example.com/a.png"), new Set()).join(), /Markdown image/);
    assert.match(checkPost(post(`${line("pr1-1")}\n\n{{< youtube x >}}`), new Set(["pr1-1"])).join(), /youtube/);
  });

  it("drops bad media lines and keeps good ones", () => {
    const body = `Intro.\n\n${line("pr1-1")}\n\n${line("pr9-1")}\n\n{{< release-media id="pr1-1" >}}\n\nEnd.`;
    const { body: out, dropped } = dropBadMedia(body, new Set(["pr1-1"]));
    assert.equal(out, `Intro.\n\n${line("pr1-1")}\n\nEnd.`);
    assert.equal(dropped.length, 2);
  });

  it("validatePost flags bad media lines and other shortcodes, not good media lines", () => {
    const p = (body) => ({ title: "Navidrome v1.0.0", description: "d", body, narration: Array(150).fill("w").join(" ") });
    const ids = new Set(["pr1-1"]);
    assert.deepEqual(validatePost(p(`A.\n\n${line("pr1-1")}`), "v1.0.0", "deluan", "", ids), []);
    assert.match(validatePost(p(line("pr2-1")), "v1.0.0", "deluan", "", ids).join(), /unknown media/);
    assert.match(validatePost(p(`${line("pr1-1")}\n\n{{< youtube x >}}`), "v1.0.0", "deluan", "", ids).join(), /Hugo shortcodes/);
    assert.match(validatePost(p("![x](https://e.com/a.png)"), "v1.0.0", "deluan", "", ids).join(), /Markdown image/);
  });

  it("keeps media lines out of the style example and away from handle links", () => {
    assert.equal(postBody(post(`Text.\n\n${line("pr1-1")}\n\nMore.`)), "Text.\n\nMore.");
    assert.equal(linkHandles(line("pr1-1", "Theme by @someone")), line("pr1-1", "Theme by @someone"));
  });

  it("sends a preview image after the text for each media item", () => {
    assert.equal(buildRequestInput("text", [], () => Buffer.from("")), "text");
    const [msg] = buildRequestInput("text", [{ id: "pr1-1", kind: "video" }], () => Buffer.from("jpg"));
    assert.deepEqual(msg.content.map((c) => c.type), ["input_text", "input_text", "input_image"]);
    assert.equal(msg.content[2].image_url, `data:image/jpeg;base64,${Buffer.from("jpg").toString("base64")}`);
  });

  it("trusts only media.json items with a safe id, a known kind and a GitHub URL", (t) => {
    const dir = tmp(t, "media-json-");
    const items = [
      { id: "pr1-1", kind: "image", url: asset(1) },
      { id: "../../x", kind: "image", url: asset(2) },
      { id: "pr1-2", kind: "script", url: asset(3) },
      { id: "pr1-3", kind: "image", url: "https://example.com/x.png" },
    ];
    writeFileSync(path.join(dir, "media.json"), JSON.stringify({ items }));
    assert.deepEqual(readMedia(dir).map((i) => i.id), ["pr1-1"]);
    assert.equal(readMedia(path.join(dir, "none")), null);
    assert.deepEqual([...mediaWithFiles(dir)], [], "no file yet");
  });
});

describe("converting media", { skip: noFfmpeg }, () => {
  it("makes images and videos fit, and turns an animated GIF into a video", (t) => {
    const src = tmp(t, "media-src-");
    const out = path.join(src, "media");
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=3001x1001", "-frames:v", "1", path.join(src, "wide.png"));
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=720x2000:duration=1:rate=10", "-pix_fmt", "yuv420p", path.join(src, "tall.mp4"));
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=320x240:duration=1:rate=5", path.join(src, "anim.gif"));
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=320x240", "-frames:v", "1", path.join(src, "still.gif"));

    assert.equal(convertMedia(path.join(src, "wide.png"), out, "a"), "image");
    assert.deepEqual(size(path.join(out, "a.jpg")), [1600, 532]);
    assert.equal(convertMedia(path.join(src, "tall.mp4"), out, "b"), "video");
    assert.deepEqual(size(path.join(out, "b.mp4")), [460, 1280]);
    assert.ok(existsSync(path.join(out, "b-poster.jpg")));
    assert.equal(convertMedia(path.join(src, "anim.gif"), out, "c"), "video");
    assert.equal(convertMedia(path.join(src, "still.gif"), out, "d"), "image");
    writeFileSync(path.join(src, "text.txt"), "not media");
    assert.throws(() => convertMedia(path.join(src, "text.txt"), out, "e"));
  });

  it("collects UI features first, at most 3 per PR, and skips items that fail", async (t) => {
    const src = tmp(t, "media-src-");
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=64x48", "-frames:v", "1", path.join(src, "img.png"));
    writeFileSync(path.join(src, "bad.txt"), "not media");
    const prs = {
      10: { title: "fix(scanner): a thing", body: `![one](${asset(10)})` },
      11: { title: "feat(ui): a page", body: [1, 2, 3, 4].map((n) => `![p${n}](${asset(110 + n)})`).join("\n") },
      12: { title: "feat(ui): broken", body: `![bad](${asset(12)})` },
    };
    const bundle = tmp(t, "media-bundle-");
    const logs = [];
    const items = await collectMedia({
      prs: [10, 11, 12, 13],
      bundle,
      fetchPr: async (n) => {
        if (!prs[n]) throw new Error("not found");
        return prs[n];
      },
      downloader: async (url, file) => copyFileSync(path.join(src, url === asset(12) ? "bad.txt" : "img.png"), file),
      log: (m) => logs.push(m),
    });
    assert.deepEqual(items.map((i) => i.id), ["pr11-1", "pr11-2", "pr11-3", "pr10-1"]);
    assert.deepEqual(items[0], { id: "pr11-1", pr: 11, pr_title: "feat(ui): a page", url: asset(111), alt: "p1", context: "", kind: "image" });
    assert.match(logs.join("\n"), /PR #13: not found/);
    assert.match(logs.join("\n"), /pr12-1/);
    assert.deepEqual(readMedia(bundle).map((i) => i.id), items.map((i) => i.id));
    assert.deepEqual([...mediaWithFiles(bundle)], items.map((i) => i.id));
  });

  it("sync keeps the shown media, downloads missing files and removes the rest", async (t) => {
    const src = tmp(t, "media-src-");
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=64x48", "-frames:v", "1", path.join(src, "img.png"));
    const bundle = tmp(t, "media-bundle-");
    const items = [
      { id: "pr1-1", kind: "image", url: asset(1) },
      { id: "pr2-1", kind: "image", url: asset(2) },
    ];
    writeFileSync(path.join(bundle, "media.json"), JSON.stringify({ items }));
    mkdirSync(path.join(bundle, "media"));
    writeFileSync(path.join(bundle, "media", "pr1-1.jpg"), "old");
    writeFileSync(path.join(bundle, "media", "stray.mp4"), "x");
    writeFileSync(path.join(bundle, "index.md"), post(line("pr2-1")));
    const downloads = [];
    const downloader = async (url, file) => {
      downloads.push(url);
      copyFileSync(path.join(src, "img.png"), file);
    };
    await syncMedia(bundle, { downloader });
    assert.deepEqual(readdirSync(path.join(bundle, "media")), ["pr2-1.jpg"]);
    assert.deepEqual(downloads, [asset(2)]);
    await syncMedia(bundle, { downloader });
    assert.equal(downloads.length, 1, "no download when the file is there");
    writeFileSync(path.join(bundle, "index.md"), post("No media."));
    await syncMedia(bundle, { downloader });
    assert.equal(existsSync(path.join(bundle, "media")), false);
  });

  it("generate-post shows the model the previews and keeps only good media lines", async (t) => {
    const tag = "v0.0.2";
    const root = tmp(t, "post-root-");
    const dir = path.join(root, "content/en/blog/releases", tag);
    ffmpeg("-f", "lavfi", "-i", "testsrc=size=64x48", "-frames:v", "1", path.join(root, "img.png"));
    convertMedia(path.join(root, "img.png"), path.join(dir, "media"), "pr5-1");
    writeFileSync(path.join(dir, "media.json"), JSON.stringify({ items: [{ id: "pr5-1", kind: "image", pr: 5, pr_title: "feat(ui): x", url: asset(5), alt: "", context: "" }] }));
    const body = `## New\n\nA page.\n\n${line("pr5-1", "The new page")}\n\n${line("pr6-1")}`;
    const result = { title: `Navidrome ${tag}`, description: "d", body, narration: Array(150).fill("word").join(" ") };
    const requests = [];
    const server = http.createServer((req, res) => {
      let data = "";
      req.on("data", (c) => (data += c));
      req.on("end", () => {
        requests.push(JSON.parse(data));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(result) }] }] }));
      });
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    t.after(() => server.close());
    const releaseFile = path.join(root, "release.json");
    writeFileSync(releaseFile, JSON.stringify({ tagName: tag, body: "notes", url: "https://example.com/r", publishedAt: "2026-11-16T00:00:00Z" }));
    const warnings = path.join(root, "warnings.md");
    const child = await new Promise((resolve) =>
      execFile(
        process.execPath,
        ["release-post/generate-post.mjs", releaseFile],
        {
          cwd: REPO_ROOT,
          env: { ...process.env, OPENAI_BASE_URL: `http://127.0.0.1:${server.address().port}/v1`, OPENAI_API_KEY: "test", RELEASE_POST_CONTENT_ROOT: root, RELEASE_POST_WARNINGS_FILE: warnings },
          timeout: 30_000,
        },
        (err, stdout, stderr) => resolve({ status: err ? 1 : 0, stderr }),
      ),
    );
    assert.equal(child.status, 0, child.stderr);
    const content = requests[0].input[0].content;
    assert.match(content[0].text, /id: pr5-1; kind: image; PR #5: feat\(ui\): x/);
    assert.equal(content[2].type, "input_image");
    assert.match(content[2].image_url, /^data:image\/jpeg;base64,\/9j\//);
    const index = readFileSync(path.join(dir, "index.md"), "utf8");
    assert.ok(index.includes(line("pr5-1", "The new page")));
    assert.ok(!index.includes("pr6-1"));
    assert.match(readFileSync(warnings, "utf8"), /removed media lines/);
    assert.deepEqual(checkPost(index, mediaWithFiles(dir)), []);
  });
});
