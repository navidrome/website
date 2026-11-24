# Release posts

When a Navidrome release is published, this repo writes a draft blog post and an audio version
from the release notes, adds screenshots and videos from the linked PRs, and opens a PR. The reviewer (default `deluan`) reviews the PR:

| Reviewer action | What happens |
| --- | --- |
| Comment or Request changes | Codex edits the post in the same PR. If `narration.txt` changed, the audio is recorded again. Then the bot replies on the PR. |
| `/regen-audio` in a review | The audio is recorded again, even if `narration.txt` did not change. |
| Approve (on the latest commit) | The PR is merged and the site is deployed. Nothing is published before this. |

Reviews from other people do nothing.

## How it works

1. `navidrome/navidrome` runs [`navidrome-release-dispatch.yml`](navidrome-release-dispatch.yml)
   when a release is published. It sends a `navidrome-release` repository dispatch to this repo.
2. [`release-post.yml`](../.github/workflows/release-post.yml) reads the release notes and runs:
   - `media.mjs collect`: downloads the screenshots and videos of the linked PRs into `media/`
     and lists them in `media.json`. See "Media".
   - `generate-post.mjs`: writes `content/en/blog/releases/<tag>/index.md`, `narration.txt` and
     `release-notes.txt` with the OpenAI Responses API. The model also sees a small preview of
     each media item, and picks the ones the post shows.
   - `media.mjs sync`: deletes the media that the post does not show.
   - `generate-audio.mjs`: records `narration.mp3` and writes `audio.json`. `audio.json` keeps a
     hash of `narration.txt`, so audio is only recorded again when the spoken text changes.
   - `assets.mjs publish`: uploads the MP3 and the media to a GitHub release. See "Where the
     audio and media live".
   - Then it opens a PR from the `release-post/<tag>` branch.
3. [`release-post-review.yml`](../.github/workflows/release-post-review.yml) handles reviews.
   Codex works on copies of the post files in a folder outside the repo, so it cannot change
   scripts, workflows or `.git`. The workflow copies back only `index.md` and `narration.txt`,
   and checks them with `check-post.mjs --fix`. The check rejects anything that looks like an
   HTML tag (even in code), shortcodes other than the player and media lines, front matter keys that
   `generate-post.mjs` does not write, and YAML escapes, tags or aliases that could hide a tag. `--fix` also links bare `@handle`s to their GitHub
   profiles. Then the workflow commits and pushes. Only the reviewer's own comments are sent
   to Codex. New audio and media are uploaded before the push. If recording the audio fails,
   the text is still pushed, and the reply says to submit a review with `/regen-audio`.

You can also start it by hand: Actions, "Release Post", "Run workflow", with a tag like `v0.65.0`.

A run does nothing for a tag that already has a post on `master`, or a PR in any state. So
closing a PR without merging means "no post for this release". To get the post after all,
reopen the PR. If a run pushed the branch but failed to open the PR, the next run opens the PR
only, with the first run's warnings.

## Setup

### In navidrome/website

Secrets:

| Name | Needed | What |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Writes the post and records the audio. |
| `CODEX_OPENAI_API_KEY` | No | Codex review edits. Without it, Codex uses `OPENAI_API_KEY`. Set it to a key from a **different OpenAI project** to see the Codex cost apart. |
| `RELEASE_POST_APP_PRIVATE_KEY` | Recommended | Private key of a GitHub App. See below. |

Variables (all optional):

| Name | Default | What |
| --- | --- | --- |
| `RELEASE_POST_ENABLED` | on | Set to `false` to stop new posts. |
| `RELEASE_POST_REVIEWER` | `deluan` | The only user whose reviews count. |
| `RELEASE_POST_MODEL` | `gpt-6.1-sol` | Model that writes the post. |
| `RELEASE_POST_AUDIO` | `on` | Set to `off` to skip audio. The post then has no player. |
| `RELEASE_POST_MEDIA` | `on` | Set to `off` to skip screenshots and videos. |
| `RELEASE_POST_TTS_ENGINE` | `realtime` | `realtime` or `speech`. See "Audio models". |
| `RELEASE_POST_TTS_MODEL` | per engine | `gpt-realtime-2.1-mini` or `gpt-4o-mini-tts`. |
| `RELEASE_POST_VOICE` | `marin` | Voice name. |
| `CODEX_MODEL`, `CODEX_EFFORT` | Codex default | Passed to `openai/codex-action`. |
| `RELEASE_POST_APP_ID` | none | ID of the GitHub App. |

The GitHub App (optional, recommended): give it **Contents**, **Pull requests** and
**Issues** read and write on this repo only. Without it, the workflows use `GITHUB_TOKEN`, and:

- The PR does not start the Preview Build, so there is no preview link and no build check.
- In Settings, Actions, General, turn on "Allow GitHub Actions to create and approve pull requests".
- After the merge, the workflow starts `prod-build-deploy.yml` itself.

Do not use a personal access token of the reviewer. The reviewer would be the PR author, and
GitHub does not let you approve your own PR.

### In navidrome/navidrome

1. Copy [`navidrome-release-dispatch.yml`](navidrome-release-dispatch.yml) to
   `.github/workflows/website-release-post.yml`.
2. Add the secret `WEBSITE_DISPATCH_TOKEN`: a fine-grained token for `navidrome/website` only,
   with "Contents: Read and write".

## Costs and credits

There are three separate cost buckets:

1. **Post and audio** (`OPENAI_API_KEY`). Each run lists its tokens in
   the job summary and on the PR. Prices change, so the scripts do not show money.
2. **Codex review edits** (`CODEX_OPENAI_API_KEY`, or `OPENAI_API_KEY` when it is not set). One run per review. `openai/codex-action`
   only works with an API key, so this is API usage, not ChatGPT plan usage.
3. **GitHub Actions minutes**. Free for this public repo.

One key works for both. To see the Codex cost apart from the rest, use two OpenAI projects, one
per key. Then each project has its own usage page, budget and limits.

About API credits, for example from
[Codex for Open Source](https://developers.openai.com/codex/codex-for-oss-terms): the terms say the
credits are "for eligible open-source maintainer workflows", and that scope can vary. They do not
list which models or endpoints count. Before you rely on them:

- Check which organization or project the credits were added to, and create the keys there.
- Check that the credits cover the audio model too, not only text models. If not, put
  `OPENAI_API_KEY` in a paid project, or set `RELEASE_POST_AUDIO=off`.
- Your ChatGPT Pro Codex usage is a different thing. It does not pay for these workflows.
- Set a budget on each project, so a bug cannot spend much.

## Audio models

OpenAI shuts down `tts-1`, `tts-1-hd` and `gpt-4o-mini-tts` on **2027-01-06**. The replacement,
`gpt-realtime-2.1-mini`, does not work with `/v1/audio/speech`. So the default engine is
`realtime`. It sends each part of the script to the Realtime API over a WebSocket and asks the
model to read it word for word.

A realtime model can drift from the script. The script compares the model's transcript with the
script. Below 90% match it tries again, up to 3 times, and then adds a warning to the PR. Listen
to the audio before you approve.

The `speech` engine is a plain text-to-speech model, so it does not improvise. Use it until 2027-01-06 if the realtime voice
drifts too much.

## Media

`media.mjs collect` reads the PRs that the release notes link to, and takes the files GitHub
hosts for them (`github.com/user-attachments/...`): images, GIFs and videos. Other URLs are
ignored. It keeps at most 3 items per PR and 16 in all, UI features first. Then ffmpeg makes them
small:

| Source | Saved as | Size |
| --- | --- | --- |
| Image, or a GIF with one frame | `media/<id>.jpg` | Longest side at most 1600 px. |
| Video, or an animated GIF | `media/<id>.mp4` (H.264) and `media/<id>-poster.jpg` | Longest side at most 1280 px, 30 fps. Videos over 3 minutes are skipped. |

A video over 20 MB is made smaller once, and then skipped, so readers do not download huge
files. An item that fails is skipped with a warning in the log. If the whole step fails, the
post is written without media.

The post shows an item with a line of its own:

```markdown
{{< release-media id="pr5835-1" alt="The Catppuccin Frappé theme" >}}
```

[`release-media.html`](../layouts/shortcodes/release-media.html) shows it as an image, or as a
video player with the poster. The id must be in `media.json`, with uploaded files.
`check-post.mjs` checks this, and the line's exact form. To change the media in a review, ask
for it: Codex can move, remove or add media lines with ids from `media.json`. The workflow
downloads and uploads the files it needs, and deletes the ones that are no longer shown.

## Where the audio and media live

Audio and video are big, and git keeps every version of a file forever. So they are not in
git. `assets.mjs publish` uploads them to a pre-release of this repo named
`blog-media-<tag>` (for example `blog-media-v0.65.0`), and writes their URLs in `audio.json`
(`url`) and `media.json` (`files`). The page links to those URLs. `.gitignore` keeps
`narration.mp3` and `media/` out of commits, and `check-post.mjs --published` fails if a
local copy is left or a shown file is not uploaded.

- File names end with a hash of the content, for example `narration-1a2b3c4d5e.mp3`. GitHub
  caches a "not found" answer for a while, so a URL is never reused for another file.
- When the audio is recorded again, or media is removed from the post, the old files are
  deleted from the release.
- GitHub serves these files as `application/octet-stream`. Browsers still play them because the
  page says the type in a `<source>` tag. Chromium, WebKit (Safari) and Firefox were tested.
- Do not delete these releases: published posts link to them. A post that was closed without
  merging leaves its release behind, which you can delete.

## Local use

```bash
npm run test:release-post   # Unit tests and a fake-API end-to-end test. Needs ffmpeg for the audio test.

gh release view v0.65.0 -R navidrome/navidrome --json tagName,name,body,url,publishedAt > /tmp/release.json
node release-post/media.mjs collect /tmp/release.json content/en/blog/releases/v0.65.0
OPENAI_API_KEY=... node release-post/generate-post.mjs /tmp/release.json
node release-post/media.mjs sync content/en/blog/releases/v0.65.0
OPENAI_API_KEY=... node release-post/generate-audio.mjs content/en/blog/releases/v0.65.0
# Uploads to a real release. Skip it to only look at the files locally.
GH_TOKEN=... GITHUB_REPOSITORY=navidrome/website node release-post/assets.mjs publish content/en/blog/releases/v0.65.0
```

The prompts are in [`prompts/`](prompts). Edit them to change the style. The newest existing post
is also sent to the model as a style example, so your edits to past posts teach it.
