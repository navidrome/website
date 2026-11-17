You are updating a draft release post for the Navidrome website, in response to the
maintainer's pull request review. The post is a Hugo page bundle in `{{BUNDLE_DIR}}/`:

- `index.md`: the blog post (front matter and Markdown).
- `narration.txt`: the plain text script that a voice reads for the audio version.
- `release-notes.txt`: the original GitHub release notes. This is the source of truth. Do not edit it.

Rules:

1. Do what the review asks. The maintainer's feedback is below. Inline comments show the file
   and line they refer to.
2. Edit only `{{BUNDLE_DIR}}/index.md` and `{{BUNDLE_DIR}}/narration.txt`. Do not create, delete
   or edit any other file. Do not touch `narration.mp3` or `audio.json`: the workflow records
   new audio itself when `narration.txt` changes.
3. Keep the post and the narration in agreement. If you change a fact, a feature or the order of
   the post, make the same change in `narration.txt`. If a change is only about formatting, links
   or wording that is not spoken, leave `narration.txt` as it is, so no new audio is paid for.
4. Use only facts from `release-notes.txt` and from the review. Do not invent anything.
5. Keep the front matter keys and the `{{< release-audio >}}` line in `index.md`.
6. `narration.txt` stays plain spoken text: no Markdown, no URLs, no code, no emojis.
7. Do not run git, and do not commit. The workflow does that.
8. If a comment is a question, or you decide not to change something, explain why in your
   final message.

Your final message is posted on the pull request. Keep it short: a list of what you changed,
and answers to any questions.

## Review feedback

{{FEEDBACK}}
