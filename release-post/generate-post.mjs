#!/usr/bin/env node
// Writes a release post bundle (index.md, narration.txt, release-notes.txt) from a Navidrome
// release, using the OpenAI Responses API.
//
// Usage: node release-post/generate-post.mjs <release.json>
// release.json comes from:
//   gh release view <tag> -R navidrome/navidrome --json tagName,name,body,url,publishedAt
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  apiBase,
  bundleDir,
  contentRoot,
  hasRawHtml,
  env,
  latestPost,
  linkHandles,
  parseTag,
  recordUsage,
  requireKey,
  slugFor,
  yamlString,
} from "./lib.mjs";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "body", "narration"],
  properties: {
    title: { type: "string", description: "Post title. Must contain the version, e.g. 'Navidrome v0.65.0: ...'." },
    description: { type: "string", description: "One sentence summary, under 160 characters." },
    body: { type: "string", description: "The post body in Markdown, without a top-level heading." },
    narration: { type: "string", description: "The plain text narration script." },
  },
};

export function buildInput(release, styleExample) {
  const parts = [
    `Release tag: ${release.tagName}`,
    `Release name: ${release.name || release.tagName}`,
    `Published: ${release.publishedAt}`,
    `Release page: ${release.url}`,
    "",
    "Release notes (Markdown):",
    "<<<RELEASE_NOTES",
    release.body,
    "RELEASE_NOTES>>>",
  ];
  if (styleExample) {
    parts.push(
      "",
      "Here is the previous release post, after the maintainer reviewed it. Match its tone, not its facts. Where its structure differs from the rules, follow the rules:",
      "<<<PREVIOUS_POST",
      styleExample,
      "PREVIOUS_POST>>>",
    );
  }
  return parts.join("\n");
}

// The Responses API returns a list of output items. We want the text of the message item.
export function extractOutput(response) {
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c.type === "refusal") throw new Error(`Model refused: ${c.refusal}`);
      if (c.type === "output_text") return JSON.parse(c.text);
    }
  }
  throw new Error(`No message in response (status: ${response.status})`);
}

export function maintainer() {
  return env("RELEASE_POST_REVIEWER", "deluan");
}

const THANKS = /\b(thank(s|ed|ing)?|grateful|gratitude|kudos|shout-?outs?)\b/i;

// True when a sentence both names the maintainer and thanks someone. Crediting the
// maintainer ("by @deluan") is fine. Thanking them is not, as they publish the post.
export function thanksMaintainer(text, owner) {
  // GitHub logins are case-insensitive. "deluan" must not match "deluan2" or "deluan-fan".
  const name = new RegExp(`(^|[^\\w-])@?${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "i");
  return String(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .some((sentence) => name.test(sentence) && THANKS.test(sentence));
}

const SECURITY = /\b(security|vulnerabilit(y|ies)|CVE-\d|GHSA-)/i;

export function validatePost(post, tag, owner = maintainer(), notes = "") {
  const problems = [];
  if (SECURITY.test(notes)) {
    if (!/^##\s.*security/im.test(post.body)) problems.push('notes mention security fixes, but the post has no "Security fixes" section');
    if (!/security/i.test(post.narration)) problems.push("notes mention security fixes, but the narration does not");
  }
  if (/^##\s+before you upgrade/im.test(post.body) && !/\bpost\b/i.test(post.narration)) {
    problems.push("the post has upgrade steps, but the narration does not point listeners to the post");
  }
  if (thanksMaintainer(post.body, owner)) problems.push(`body thanks the maintainer @${owner}`);
  if (thanksMaintainer(post.narration, owner)) problems.push(`narration thanks the maintainer ${owner}`);
  if (!post.title.includes(tag)) problems.push(`title does not contain ${tag}`);
  if (/^#\s/m.test(post.body)) problems.push("body has a top-level heading");
  if (/\{\{[<%]/.test(post.body)) problems.push("body has Hugo shortcodes");
  if (hasRawHtml(post.body)) problems.push("body has raw HTML");
  if (/https?:\/\/|[`*#@]/.test(post.narration)) problems.push("narration has URLs or Markdown");
  const n = post.narration.split(/\s+/).filter(Boolean).length;
  if (n < 80 || n > 800) problems.push(`narration has ${n} words (asked for 150 to 600)`);
  return problems;
}

export function renderIndex(post, release) {
  const date = release.publishedAt.slice(0, 10);
  return `---
title: ${yamlString(post.title)}
linkTitle: ${yamlString(release.tagName)}
date: ${date}
description: ${yamlString(post.description)}
slug: ${slugFor(release.tagName)}
author: Navidrome
release: ${yamlString(release.tagName)}
release_url: ${yamlString(release.url)}
# Publish only the files the page uses (the audio), not the narration, notes or audio.json.
build:
  publishResources: false
---

{{< release-audio >}}

${linkHandles(post.body.trim())}

For technical details, such as API, plugin and command line changes, read the
[full release notes on GitHub](${release.url}).
`;
}

async function callModel(release) {
  const model = env("RELEASE_POST_MODEL", "gpt-6.1-sol");
  const instructions = readFileSync(path.join(REPO_ROOT, "release-post/prompts/post.md"), "utf8").replaceAll(
    "{{MAINTAINER}}",
    maintainer(),
  );
  const res = await fetch(`${apiBase()}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${requireKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      instructions,
      input: buildInput(release, latestPost(release.tagName)),
      store: false,
      text: { format: { type: "json_schema", name: "release_post", strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok) throw new Error(`Responses API returned ${res.status}: ${await res.text()}`);
  const json = await res.json();
  recordUsage({ step: "post", model: json.model ?? model, usage: json.usage });
  return extractOutput(json);
}

async function main() {
  const [releaseFile] = process.argv.slice(2);
  if (!releaseFile) throw new Error("Usage: generate-post.mjs <release.json>");
  const release = JSON.parse(readFileSync(releaseFile, "utf8"));
  const { tag } = parseTag(release.tagName);
  const dir = path.join(contentRoot(), bundleDir(tag));
  if (existsSync(path.join(dir, "index.md"))) throw new Error(`${bundleDir(tag)}/index.md already exists`);

  let post;
  let problems = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    post = await callModel(release);
    problems = validatePost(post, tag, maintainer(), release.body);
    if (!problems.length) break;
    console.warn(`Attempt ${attempt}: ${problems.join("; ")}`);
  }

  // These two would put the model's output on the page unescaped, so they stop the run.
  const blocking = problems.filter((p) => /raw HTML|shortcodes/.test(p));
  if (blocking.length) throw new Error(`Refusing to write the post: ${blocking.join("; ")}`);

  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.md"), renderIndex(post, release));
  writeFileSync(path.join(dir, "narration.txt"), `${post.narration.trim()}\n`);
  // Kept so reviewers and Codex can check the post against the source.
  writeFileSync(path.join(dir, "release-notes.txt"), `${release.body.trim()}\n`);
  // Still open a PR: the reviewer can fix the rest, or ask Codex to.
  if (problems.length && process.env.RELEASE_POST_WARNINGS_FILE) {
    writeFileSync(process.env.RELEASE_POST_WARNINGS_FILE, problems.map((p) => `- ${p}`).join("\n") + "\n");
  }
  console.log(bundleDir(tag));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
