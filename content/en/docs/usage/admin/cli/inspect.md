---
title: "navidrome inspect"
linkTitle: "inspect"
date: 2026-09-13
weight: 40
description: >
  Print the tags of music files as Navidrome reads them
---

The `inspect` command prints the tags of one or more music files, the way Navidrome reads them. Use
it when an album shows up split in two, or a tag you set doesn't appear in Navidrome. For each file
it prints the raw tags stored in the file and the mapped tags Navidrome uses. See
[Tagging](/docs/usage/library/tagging/) for how Navidrome maps tags.

## Usage

```bash
navidrome inspect [flags] <file> [<file>...]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Flags

| Flag           | Default      | Description                                                    |
| -------------- | ------------ | -------------------------------------------------------------- |
| `-f, --format` | `jsonindent` | Output format. One of `pretty`, `toml`, `yaml`, `json`, `jsonindent` |

`pretty` prints a text block for each file, with the raw and mapped tags in TOML. `json` prints
everything on one line, and `jsonindent` prints indented JSON.

## Examples

```bash
# Print the tags of one file as indented JSON
navidrome inspect "/music/Artist/Album/01 Track.flac"

# Print the tags of every MP3 in a folder, as YAML
navidrome inspect --format yaml /music/Artist/Album/*.mp3

# Easy-to-read output
navidrome inspect --format pretty "/music/Artist/Album/01 Track.flac"

# Inspect a file with Docker Compose. Use the path inside the container
docker compose run --rm navidrome inspect "/music/Artist/Album/01 Track.flac"
```

## Notes

`inspect` skips files that are not audio files, and files it can't read. It logs a warning for each
one and goes on with the rest.
