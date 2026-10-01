---
title: "navidrome pls"
linkTitle: "pls"
date: 2026-09-13
weight: 70
description: >
  List, export, and import playlists
---

The `pls` commands list playlists, export them to M3U files, and import M3U files as playlists.

Navidrome also imports M3U files it finds in your library when it scans. You don't need
`pls import` for those. See `AutoImportPlaylists` and `PlaylistsPath` in
[Configuration Options](/docs/usage/configuration/options/).

## Usage

```bash
navidrome pls --playlist <name-or-id> [--output <file>]
navidrome pls <subcommand> [flags]
```

`pls` with no subcommand exports one playlist. [`pls export`](#pls-export) does the same, and it
can also export many playlists at once.

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Flags

These flags are for `pls` with no subcommand.

| Flag             | Default | Description                                                       |
| ---------------- | ------- | ----------------------------------------------------------------- |
| `-p, --playlist` |         | Name or ID of the playlist to export. Required                    |
| `-o, --output`   |         | File to write the playlist to. Without it, or with `-`, prints to stdout |

## Examples

```bash
# Print a playlist to stdout
navidrome pls --playlist "Road Trip Mix"

# Write a playlist to a file
navidrome pls --playlist "Road Trip Mix" --output ./road-trip.m3u8
```

## Subcommands

| Subcommand              | Description                     |
| ----------------------- | ------------------------------- |
| [`list`](#pls-list)     | List playlists                  |
| [`export`](#pls-export) | Export playlists to M3U files   |
| [`import`](#pls-import) | Import M3U files as playlists   |

### `pls list`

Lists playlists, sorted by owner. The CSV output has these columns: playlist id, playlist name,
owner id, owner name, and public.

```bash
navidrome pls list [-u <user>] [-f csv|json]
```

#### Flags

| Flag           | Default | Description                              |
| -------------- | ------- | ---------------------------------------- |
| `-u, --user`   |         | Only list playlists of this username or user ID |
| `-f, --format` | `csv`   | Output format. One of `csv`, `json`      |

#### Examples

```bash
# List all playlists as CSV
navidrome pls list

# List the playlists of one user as JSON
navidrome pls list --user alice --format json
```

### `pls export`

Exports one playlist or many playlists to M3U files.

```bash
navidrome pls export [-p <playlist>] [-u <user>] [-o <folder>]
```

What it does depends on the flags you pass:

- With `--playlist` and no `--output`, it prints that playlist to stdout.
- With `--playlist` and `--output`, it writes that playlist to a file in the output folder.
- Without `--playlist`, it writes every playlist to the output folder. Add `--user` to export only
  the playlists of one user. `--output` is required here.

`--output` is a folder, and the folder must already exist. This is different from `pls --output`,
which takes a file. Each file gets the name of its playlist, such as `Road Trip Mix.m3u`. If two
playlists have the same name, Navidrome adds the first 6 characters of the playlist ID to the file
name, such as `Road Trip Mix_3Unsdw.m3u`.

#### Flags

| Flag             | Default | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| `-p, --playlist` |         | Name or ID of one playlist to export             |
| `-o, --output`   |         | Folder to write the M3U files to                 |
| `-u, --user`     |         | Only export playlists of this username or user ID |

#### Examples

```bash
# Export all playlists to a folder
navidrome pls export --output ./playlists

# Export the playlists of one user
navidrome pls export --user alice --output ./playlists

# Export one playlist to a folder
navidrome pls export --playlist "Road Trip Mix" --output ./playlists
```

### `pls import`

Imports one or more M3U files as playlists. Navidrome matches each entry in the file to a track in
your library. For each file, it prints how many tracks matched and how many it didn't find. If one
file fails, the command prints the error and goes on with the rest.

```bash
navidrome pls import [-u <user>] [--sync] <file> [<file>...]
```

By default, the first admin user owns the imported playlists. Pass `--user` to pick another owner.

A synced playlist follows its M3U file. You can't edit its tracks in Navidrome. If the file is in
your library, the scanner updates the playlist when the file changes. Without `--sync`, the
playlist keeps the tracks from the import, and you can edit them.

#### Flags

| Flag         | Default      | Description                                  |
| ------------ | ------------ | -------------------------------------------- |
| `-u, --user` | First admin  | Username or user ID of the playlist owner    |
| `--sync`     | `false`      | Mark the imported playlists as synced        |

#### Examples

```bash
# Import one file
navidrome pls import ./road-trip.m3u

# Import many files for one user
navidrome pls import --user alice ./playlists/*.m3u

# Import a playlist from the library and keep it synced with the file
navidrome pls import --sync "/music/Playlists/Favorites.m3u"

# With Docker Compose, mount the files so the container can read them
docker compose run --rm -v ./playlists:/playlists navidrome pls import /playlists/road-trip.m3u
```
