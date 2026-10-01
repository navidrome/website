---
title: "navidrome scan"
linkTitle: "scan"
date: 2026-09-13
weight: 80
description: >
  Scan the music library
---

The `scan` command scans your music library for new, changed, and removed files. Use it to start a
scan from a script, to force a full scan, or to scan only some folders.

## Usage

```bash
navidrome scan [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Flags

| Flag            | Default | Description                                                                 |
| --------------- | ------- | --------------------------------------------------------------------------- |
| `-f, --full`    | `false` | Check all folders and ignore modification times                             |
| `-t, --target`  |         | Scan only this folder, as a `libraryID:folderPath` pair. Repeatable         |
| `--target-file` |         | File with folders to scan, one `libraryID:folderPath` pair per line         |

Navidrome also has a `--subprocess` flag. The server uses it to run scans, so don't pass it
yourself.

## Examples

```bash
# Scan for changes
navidrome scan

# Full scan
navidrome scan --full

# Scan only two folders, in two libraries
navidrome scan -t 1:Music/Rock -t 2:Audiobooks

# Read the folders to scan from a file
navidrome scan --target-file ./scan-targets.txt

# Full scan with Docker Compose
docker compose run --rm navidrome scan --full
```

## Scan targets

A target is a library ID and a folder in that library, joined by a colon. The folder path is
relative to the root folder of the library. For example, `1:Music/Rock` is the `Music/Rock` folder
in library 1.

To find library IDs, run `navidrome user list`. Its libraries column shows each library as
`id:path`. See [Multi-Library](/docs/usage/features/multi-library/) for how libraries work.

A target file has one target on each line. The command skips empty lines. If you pass both
`--target-file` and `--target`, the command uses only the file.
