// Shared helpers for the release post scripts. No npm dependencies: Node 24+ only.
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const RELEASES_DIR = "content/en/blog/releases";

// Where content is written. Tests point it at a temporary folder.
export function contentRoot() {
  return process.env.RELEASE_POST_CONTENT_ROOT || REPO_ROOT;
}

// Only stable Navidrome tags. Anything else (prereleases, odd input) is rejected early,
// because the tag ends up in paths, branch names and shell commands.
const TAG_RE = /^v(\d+)\.(\d+)\.(\d+)$/;

export function parseTag(tag) {
  const m = TAG_RE.exec(String(tag ?? "").trim());
  if (!m) throw new Error(`Not a stable Navidrome release tag: ${JSON.stringify(tag)}`);
  return { tag: m[0], major: +m[1], minor: +m[2], patch: +m[3] };
}

// The page bundle that holds the post, its narration and its audio.
export function bundleDir(tag) {
  return path.posix.join(RELEASES_DIR, parseTag(tag).tag);
}

// Branch names are "release-post/<tag>".
export function tagFromBranch(branch) {
  const prefix = "release-post/";
  if (!String(branch).startsWith(prefix)) throw new Error(`Not a release post branch: ${branch}`);
  return parseTag(branch.slice(prefix.length)).tag;
}

export function slugFor(tag) {
  return `navidrome-${parseTag(tag).tag.replaceAll(".", "-")}`;
}

// Text used for the audio hash. Whitespace changes alone must not cause a new (paid) recording.
export function normalizeNarration(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

export function narrationHash(text) {
  return createHash("sha256").update(normalizeNarration(text)).digest("hex");
}

// Splits narration into chunks of at most maxChars, on paragraph and then sentence borders.
export function chunkText(text, maxChars) {
  const pieces = [];
  for (const para of normalizeNarration(text).split("\n\n")) {
    if (para.length <= maxChars) {
      pieces.push(para);
      continue;
    }
    let current = "";
    // Split after sentence punctuation that is followed by a space, so "0.65.0" stays whole.
    for (const sentence of para.split(/(?<=[.!?]["')\]]*)\s+/)) {
      const s = sentence.trim();
      if (s.length > maxChars) throw new Error(`A sentence is longer than ${maxChars} characters`);
      if (current && current.length + 1 + s.length > maxChars) {
        pieces.push(current);
        current = s;
      } else {
        current = current ? `${current} ${s}` : s;
      }
    }
    if (current) pieces.push(current);
  }
  // Merge small neighbours so we make as few API calls as possible.
  const chunks = [];
  for (const p of pieces) {
    const last = chunks.at(-1);
    if (last !== undefined && last.length + 2 + p.length <= maxChars) chunks[chunks.length - 1] = `${last}\n\n${p}`;
    else chunks.push(p);
  }
  return chunks;
}

function words(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Word-level similarity (0..1) between the script and what the voice model says it read.
// Used to catch a realtime model that improvises instead of reading the script.
export function wordSimilarity(a, b) {
  const x = words(a);
  const y = words(b);
  if (!x.length && !y.length) return 1;
  if (!x.length || !y.length) return 0;
  let prev = new Array(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) {
    const cur = new Array(y.length + 1).fill(0);
    for (let j = 1; j <= y.length; j++) {
      cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return (2 * prev[y.length]) / (x.length + y.length);
}

// Checks a post's index.md before it is committed or published. Returns a list of problems.
export function checkPost(indexMd) {
  const m = /^---\n[\s\S]*?\n---\n/.exec(String(indexMd).replace(/\r\n/g, "\n"));
  if (!m) return ["index.md has no front matter"];
  const body = indexMd.replace(/\r\n/g, "\n").slice(m[0].length);
  const problems = [];
  if (hasRawHtml(body)) problems.push("index.md has raw HTML");
  const shortcodes = [...body.matchAll(/\{\{[<%]\s*\/?\s*([\w/-]+)/g)].map((x) => x[1]);
  const others = shortcodes.filter((n) => n !== "release-audio");
  if (others.length) problems.push(`index.md has shortcodes other than release-audio: ${others.join(", ")}`);
  if (!shortcodes.includes("release-audio")) problems.push("index.md lost the {{< release-audio >}} line");
  return problems;
}

// The site renders Markdown with goldmark's unsafe mode, so HTML in a post goes to the page as is.
// Model output and Codex edits must not add any. Code spans and autolinks are allowed.
export function hasRawHtml(markdown) {
  const text = String(markdown)
    .replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, "")
    .replace(/(`+)[\s\S]*?\1/g, "")
    .replace(/<(?:https?:\/\/|mailto:)[^>\s]*>/gi, "");
  return /<\/?[a-z!?][^>]*>/i.test(text);
}

// Parts of Markdown where an @ must stay as it is: fenced code, code spans, links, autolinks, URLs.
const NO_LINK = String.raw`^(\`{3,}|~{3,})[\s\S]*?^\1[^\n]*$|(\`+)[\s\S]*?\2|!?\[[^\]\n]*\]\([^)\n]*\)|<[^>\s]+>|https?:\/\/[^\s)>\]]+`;
// A GitHub login: letters, digits and single inner hyphens, 39 characters at most. It must not
// be part of an email ("a@b.c"), a path, or a team ("@org/team").
const HANDLE = String.raw`(?<![\w@./\`\[-])@([A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38})(?![\w/-])`;

// Turns each bare "@handle" into a link to that GitHub profile.
export function linkHandles(markdown) {
  return String(markdown).replace(new RegExp(`${NO_LINK}|${HANDLE}`, "gm"), (match, _f, _c, login) =>
    login ? `[@${login}](https://github.com/${login})` : match,
  );
}

// Same as linkHandles, for a whole index.md. The front matter is left as it is.
export function linkHandlesInPost(indexMd) {
  const m = /^---\n[\s\S]*?\n---\n/.exec(indexMd);
  return m ? m[0] + linkHandles(indexMd.slice(m[0].length)) : linkHandles(indexMd);
}

// Finds the most recent existing release post, to use as a style example.
export function latestPost(excludeTag) {
  const root = path.join(contentRoot(), RELEASES_DIR);
  if (!existsSync(root)) return null;
  const candidates = readdirSync(root)
    .filter((d) => d !== excludeTag && TAG_RE.test(d) && statSync(path.join(root, d)).isDirectory())
    .filter((d) => existsSync(path.join(root, d, "index.md")))
    .sort((a, b) => {
      const pa = parseTag(a);
      const pb = parseTag(b);
      return pb.major - pa.major || pb.minor - pa.minor || pb.patch - pa.patch;
    });
  if (!candidates.length) return null;
  return readFileSync(path.join(root, candidates[0], "index.md"), "utf8");
}

export function yamlString(s) {
  return JSON.stringify(String(s));
}

export function env(name, fallback) {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

export function apiBase() {
  return env("OPENAI_BASE_URL", "https://api.openai.com/v1").replace(/\/+$/, "");
}

export function requireKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set. Add it as a repository secret (see release-post/README.md).");
  return key;
}

// Usage is logged per cost bucket so the generation key and the Codex key can be told apart.
// Prices change, so we report tokens and characters, not money. The OpenAI project dashboard
// for each key is the source of truth for cost and for which credits were applied.
export function recordUsage(entry) {
  const line = { bucket: "generation", at: new Date().toISOString(), ...entry };
  console.log(`usage: ${JSON.stringify(line)}`);
  if (process.env.RELEASE_POST_USAGE_FILE) appendFileSync(process.env.RELEASE_POST_USAGE_FILE, `${JSON.stringify(line)}\n`);
}

export function readUsage(file) {
  if (!file || !existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

export function usageMarkdown(entries) {
  if (!entries.length) return "_No API usage recorded._";
  const rows = entries.map((e) => {
    const tokens = e.usage ? `in ${e.usage.input_tokens ?? "?"} / out ${e.usage.output_tokens ?? "?"}` : "n/a";
    return `| ${e.bucket} | ${e.step} | \`${e.model}\` | ${tokens} | ${e.characters ?? ""} |`;
  });
  return ["| Bucket | Step | Model | Tokens | Characters |", "| --- | --- | --- | --- | --- |", ...rows].join("\n");
}
