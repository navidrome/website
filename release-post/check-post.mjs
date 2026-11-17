#!/usr/bin/env node
// Exits 1 when a post has raw HTML, unknown shortcodes, or lost its audio player line.
// Usage: node release-post/check-post.mjs <path/to/index.md>
import { readFileSync } from "node:fs";
import { checkPost } from "./lib.mjs";

const [file] = process.argv.slice(2);
const problems = checkPost(readFileSync(file, "utf8"));
for (const p of problems) console.error(`::error file=${file}::${p}`);
process.exit(problems.length ? 1 : 0);
