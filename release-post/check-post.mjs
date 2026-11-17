#!/usr/bin/env node
// Exits 1 when a post has raw HTML, unknown shortcodes, media without a file, or lost its audio
// player line.
// With --fix, it first turns bare @handles into links to their GitHub profiles.
// Usage: node release-post/check-post.mjs <path/to/index.md> [--fix]
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { checkPost, linkHandlesInPost } from "./lib.mjs";
import { mediaWithFiles } from "./media.mjs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
let text = readFileSync(file, "utf8");
if (args.includes("--fix")) {
  const fixed = linkHandlesInPost(text);
  if (fixed !== text) writeFileSync(file, (text = fixed));
}
const problems = checkPost(text, mediaWithFiles(path.dirname(file)));
for (const p of problems) console.error(`::error file=${file}::${p}`);
process.exit(problems.length ? 1 : 0);
