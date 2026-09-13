---
title: "navidrome missing"
linkTitle: "missing"
date: 2026-09-13
weight: 50
description: >
  List missing files and remap them onto existing files
---

The `missing` commands list files marked as missing, and remap a missing file onto an existing one.

The scanner marks a file missing when it no longer finds it on disk. When you rename or move a file,
the scanner normally reconnects it and carries over play counts, ratings, starred status, and
bookmarks. If the scanner can't match the two files, the old entry stays missing and the new file
starts with no history. `missing fix` does that remap by hand.

See [Missing Files](/docs/usage/library/missing-files/) for why files go missing, how to review them
in the web UI, and how to purge them for good.

## Usage

```bash
navidrome missing <subcommand> [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Subcommands

| Subcommand                | Description                               |
| ------------------------- | ----------------------------------------- |
| [`list`](#missing-list)   | List all files marked as missing          |
| [`fix`](#missing-fix)     | Remap a missing file onto an existing file |

### `missing list`

Lists all files marked as missing. The CSV output has these columns: id, library id, title, album,
artist, and path.

```bash
navidrome missing list [-f csv|json]
```

#### Flags

| Flag           | Default | Description                          |
| -------------- | ------- | ------------------------------------ |
| `-f, --format` | `csv`   | Output format. One of `csv`, `json`  |

#### Examples

```bash
# List missing files as CSV
navidrome missing list

# List missing files as JSON
navidrome missing list --format json
```

### `missing fix`

Moves the data of a missing file onto an existing file.

```bash
navidrome missing fix <missing> <target>
```

The first argument is the missing file. The second is the file that gets its data. Each argument can
be a media file ID, a library-relative path, or a `libraryID:path` pair. Use an ID or a
`libraryID:path` pair when the same path exists in more than one library.

#### Flags

This subcommand has no flags.

#### Examples

```bash
# Remap by library-relative path
navidrome missing fix "Rock/Old Album/track01.mp3" "Rock/New Album/track01.mp3"

# Remap by media file ID
navidrome missing fix 3Unsdwsei9i2ZvRtFKRfwA 7KpqZmXe4Ab2NvTuGHRcxQ

# Pick the library with a libraryID:path pair
navidrome missing fix 2:"Podcasts/ep01.mp3" 2:"Podcasts/episode-01.mp3"
```

{{% alert color="warning" title="Important" %}}
The target file must already be in the library and must not be missing. Run a scan first if you
just added it. You can't undo the remap, so make a backup with `navidrome backup create` before you
fix many files.
{{% /alert %}}
