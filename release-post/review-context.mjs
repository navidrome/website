#!/usr/bin/env node
// Turns a pull request review into a prompt for Codex.
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, REVIEW_ID, REVIEW_BODY, REVIEWER, BUNDLE,
//      PROMPT_FILE (output), GITHUB_OUTPUT (optional, for has_feedback and force_audio).
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib.mjs";

export const REGEN_COMMAND = "/regen-audio";

// Groups review comments into threads, and keeps the threads the given review added to.
// Only the reviewer's comments are kept. Anyone can comment on a public PR, and their text
// must not reach Codex.
export function threadsForReview(comments, reviewId, reviewer) {
  const byId = new Map(comments.map((c) => [c.id, c]));
  const rootOf = (c) => {
    let cur = c;
    while (cur.in_reply_to_id && byId.has(cur.in_reply_to_id)) cur = byId.get(cur.in_reply_to_id);
    return cur.id;
  };
  const threads = new Map();
  for (const c of [...comments].sort((a, b) => a.id - b.id)) {
    const root = rootOf(c);
    if (!threads.has(root)) threads.set(root, []);
    threads.get(root).push(c);
  }
  return [...threads.values()]
    .filter((t) => t.some((c) => c.pull_request_review_id === reviewId))
    .map((t) => t.filter((c) => c.user?.login === reviewer))
    .filter((t) => t.length);
}

export function formatFeedback({ body, threads, reviewer }) {
  const out = [];
  if (body?.trim()) out.push(`### Review summary from @${reviewer}\n\n${body.trim()}`);
  for (const t of threads) {
    const first = t[0];
    const line = first.line ?? first.original_line;
    out.push(
      [
        `### Comment on \`${first.path}\`${line ? ` line ${line}` : ""}`,
        "",
        "```diff",
        (first.diff_hunk ?? "").split("\n").slice(-8).join("\n"),
        "```",
        "",
        ...t.map((c) => c.body.trim()),
      ].join("\n"),
    );
  }
  return out.join("\n\n");
}

// True when the only thing the reviewer asked for is new audio.
export function wantsAudioOnly(texts) {
  const joined = texts.join("\n").trim();
  return joined.length > 0 && joined.replaceAll(REGEN_COMMAND, "").trim() === "";
}

async function gh(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${url} returned ${res.status}`);
  return { json: await res.json(), next: /<([^>]+)>;\s*rel="next"/.exec(res.headers.get("link") ?? "")?.[1] };
}

async function main() {
  const { GITHUB_REPOSITORY: repo, PR_NUMBER: pr, REVIEWER: reviewer, BUNDLE: dir, PROMPT_FILE: promptFile } = process.env;
  for (const [name, value] of Object.entries({ GITHUB_REPOSITORY: repo, PR_NUMBER: pr, REVIEWER: reviewer, BUNDLE: dir, PROMPT_FILE: promptFile })) {
    if (!value) throw new Error(`${name} is not set`);
  }
  const reviewId = Number(process.env.REVIEW_ID);
  const body = process.env.REVIEW_BODY ?? "";

  const comments = [];
  let url = `https://api.github.com/repos/${repo}/pulls/${pr}/comments?per_page=100`;
  while (url) {
    const page = await gh(url);
    comments.push(...page.json);
    url = page.next;
  }
  const threads = threadsForReview(comments, reviewId, reviewer);
  const reviewerTexts = [body, ...threads.flatMap((t) => t.filter((c) => c.pull_request_review_id === reviewId).map((c) => c.body))];
  const forceAudio = reviewerTexts.some((t) => t.includes(REGEN_COMMAND));
  const audioOnly = wantsAudioOnly(reviewerTexts);
  const hasFeedback = !audioOnly && reviewerTexts.some((t) => t.trim());

  const template = readFileSync(path.join(REPO_ROOT, "release-post/prompts/revise.md"), "utf8");
  const prompt = template.replaceAll("{{BUNDLE_DIR}}", dir).replace("{{FEEDBACK}}", () => formatFeedback({ body, threads, reviewer }));
  writeFileSync(promptFile, prompt);

  const outputs = `has_feedback=${hasFeedback}\nforce_audio=${forceAudio}\n`;
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, outputs);
  console.log(outputs.trim());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
