#!/usr/bin/env node
// Prints the body of a release post PR.
// Usage: node release-post/pr-body.mjs <tag> <release-url> <reviewer> [usage.jsonl] [warnings.md]
import { existsSync, readFileSync } from "node:fs";
import { bundleDir, env, mediaReleaseTag, readUsage, usageMarkdown } from "./lib.mjs";

const [tag, url, reviewer, usageFile, warningsFile] = process.argv.slice(2);
const dir = bundleDir(tag);
const assets = `https://github.com/${env("GITHUB_REPOSITORY", "navidrome/website")}/releases/tag/${mediaReleaseTag(tag)}`;
const warnings = warningsFile && existsSync(warningsFile) ? readFileSync(warningsFile, "utf8").trim() : "";

console.log(`## Description

Draft blog post and audio for [Navidrome ${tag}](${url}), written from the release notes.

- Post: \`${dir}/index.md\`
- Narration script: \`${dir}/narration.txt\`
- Audio, screenshots and videos: in the [${mediaReleaseTag(tag)}](${assets}) release, not in git. \`audio.json\` and \`media.json\` have their URLs.
${warnings ? `\n> [!WARNING]\n> Checks found problems. Fix them before you approve:\n${warnings.split("\n").map((l) => `> ${l}`).join("\n")}\n` : ""}
## How to review (@${reviewer} only)

- **Comment** or **Request changes**: Codex edits the post in this PR. If the spoken text changes, the audio is recorded again.
- Put \`/regen-audio\` in a review to record the audio again without other changes.
- **Approve**: the PR is merged and the site is deployed. The approval must be on the latest commit.

## API usage (generation key)

${usageMarkdown(readUsage(usageFile))}

Codex review edits are not in this table. They use \`CODEX_OPENAI_API_KEY\`, or the generation key when that one is not set.

## Type of change

- [ ] App catalog entry (new app or update)
- [ ] Documentation
- [x] Blog post
- [ ] Bug fix
- [ ] Styling / layout
- [ ] Other

## Checklist

- [ ] The build passes (\`npm run build\`)
- [ ] I previewed my changes locally (\`npm start\`) when relevant`);
