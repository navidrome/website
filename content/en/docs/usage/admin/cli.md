---
title: "Command-Line Interface (CLI)"
linkTitle: "CLI"
date: 2026-04-19
weight: 15
description: >
  Reference for Navidrome command-line commands and common workflows
---

Navidrome includes a built-in CLI for administration tasks, maintenance, and troubleshooting.

Use this page as a practical reference for common command-line workflows and examples.

## Quick start

Use the built-in help:

```bash
navidrome --help
```

Get help for a specific command:

```bash
navidrome <command> --help
navidrome <command> <subcommand> --help
```

If you run `navidrome` with no subcommand, it starts the server.

## Running the CLI in Docker / Docker Compose

If Navidrome runs in a container, run CLI commands through that container so they use the same
`/data`, `/music`, and environment/config as your server.

### Docker Compose

Use `docker compose run` with your Navidrome service name (typically `navidrome`):

```bash
# Show CLI help
docker compose run --rm navidrome --help

# Run a full scan
docker compose run --rm navidrome scan --full

# List users
docker compose run --rm navidrome user list
```

If your Navidrome service is already running and you want to run commands in that same container,
you can use `docker compose exec`:

```bash
docker compose exec navidrome navidrome user list
```

With `exec`, include the `navidrome` binary explicitly before the subcommand.

### Docker (`docker run`)

Start a one-off container with the same mounts and settings used by your main Navidrome container:

```bash
docker run --rm \
  --user $(id -u):$(id -g) \
  -v /path/to/music:/music:ro \
  -v /path/to/data:/data \
  --env-file /path/to/navidrome.env \
  -e ND_CONFIGFILE=/data/navidrome.toml \
  deluan/navidrome:latest \
  user list
```

For consistency, keep image tag, volumes, and environment variables aligned with your running
instance.

## Global flags

These flags are available across commands:

- `-c, --configfile`: Load a specific config file
- `-n, --nobanner`: Disable startup banner
- `--musicfolder`, `--datafolder`, `--cachefolder`
- `-l, --loglevel`, `--logfile`

Example:

```bash
navidrome -c /etc/navidrome/navidrome.toml --nobanner
```

## Command overview

The built-in top-level administrative commands are: `inspect`, `scan`, `missing`, `backup`, `pls`, `service`, `user`, and `plugin`.

### `inspect`

Inspect music file tags as Navidrome sees them.

```bash
navidrome inspect <file1> [file2 ...]
```

Supported output formats (`-f, --format`):

- `pretty`
- `toml`
- `yaml`
- `json`
- `jsonindent` (default)

Example:

```bash
navidrome inspect --format yaml "/music/Artist/Album/Track01.flac"
```

---

### `scan`

Run a library scan from the CLI.

```bash
navidrome scan
```

Useful flags:

- `-f, --full`: Ignore timestamps and check all subfolders
- `-t, --target`: Scan specific folders using `libraryID:folderPath` pairs (repeatable)
- `--target-file`: Read targets from a file (one `libraryID:folderPath` per line)

Examples:

```bash
# Full scan
navidrome scan --full

# Scan only selected folders
navidrome scan -t 1:Music/Rock -t 2:Audiobooks

# Read scan targets from file
navidrome scan --target-file ./scan-targets.txt
```

---

### `missing`

List files marked as missing, and remap a missing file onto an existing one.

A file is marked missing when the scanner no longer finds it on disk. When you rename or move a
file, the scanner normally reconnects it and carries over play counts, ratings, starred status and
bookmarks. If the scanner cannot match the two files, the old entry stays missing and the new file
starts with no history. `missing fix` does that remap by hand.

```bash
navidrome missing --help
```

Subcommands:

- `list`: List all files currently marked as missing
- `fix <missing> <target>`: Remap a missing file onto an existing file

`missing list` flags:

- `-f, --format`: Output format (`csv` or `json`, default: `csv`)

`missing fix` takes two arguments. The first is the missing file, the second is the file to move
the data onto. Each argument can be a media file ID, a library-relative path, or a
`libraryID:path` pair. Use an ID or a `libraryID:path` pair when the same path exists in more than
one library.

Examples:

```bash
# List missing files as CSV (id, library id, title, album, artist, path)
navidrome missing list

# List missing files as JSON
navidrome missing list --format json

# Remap by library-relative path
navidrome missing fix "Rock/Old Album/track01.mp3" "Rock/New Album/track01.mp3"

# Remap by media file ID
navidrome missing fix 3Unsdwsei9i2ZvRtFKRfwA 7KpqZmXe4Ab2NvTuGHRcxQ

# Disambiguate with a libraryID:path pair
navidrome missing fix 2:"Podcasts/ep01.mp3" 2:"Podcasts/episode-01.mp3"
```

{{% alert color="warning" title="Important" %}}
The target file must already be in the library and must not be missing. Run a scan first if you
just added it. The remap cannot be undone, so make a backup with `navidrome backup create` before
you fix many files.
{{% /alert %}}

See [Missing Files](/docs/usage/library/missing-files/) for why files go missing, how to review them
in the web UI, and how to purge them for good.

---

### `backup` (alias: `bkp`)

Manage database backups.

```bash
navidrome backup --help
```

Subcommands:

- `navidrome backup create` (alias: `c`)
- `navidrome backup prune` (alias: `p`)
- `navidrome backup restore` (alias: `r`)

Common flags:

- `backup create`: `-d, --backup-dir`
- `backup prune`: `-d, --backup-dir`, `-k, --keep-count`, `-f, --force`
- `backup restore`: `-b, --backup-file` (required), `-f, --force`

{{% alert color="warning" title="Important" %}}
`navidrome backup restore` must be run while Navidrome is **not running**.
{{% /alert %}}

Examples:

```bash
# Create a backup in the configured backup path
navidrome backup create

# Prune and keep only the newest 7 backups
navidrome backup prune --keep-count 7

# Restore from a specific backup file (offline only)
navidrome backup restore --backup-file /backups/navidrome.db.2026-04-01-040000
```


---

### `pls` (playlist export)

Export playlists to M3U and list playlists from the CLI.

```bash
navidrome pls --playlist <playlist-name-or-id>
```

Useful flags:

- `-p, --playlist` (required): Playlist name or ID
- `-o, --output`: Output file path (`-` or omitted writes to stdout)

Examples:

```bash
# Export a playlist to stdout
navidrome pls --playlist "Road Trip Mix"

# Export a playlist to a file
navidrome pls --playlist "Road Trip Mix" --output ./road-trip.m3u8
```

`pls` also includes a `list` subcommand to enumerate playlists:

```bash
# List all playlists (CSV)
navidrome pls list

# List playlists for a specific user as JSON
navidrome pls list --user alice --format json
```

`pls list` flags:

- `-u, --user`: Filter by username or user ID
- `-f, --format`: Output format (`csv` or `json`, default: `csv`)

---

### `service` (alias: `svc`)

Manage Navidrome as an OS service.

```bash
navidrome service --help
# same as: navidrome svc --help
```

Subcommands:

- `install`
- `uninstall`
- `start`
- `stop`
- `status`
- `execute`

Example:

```bash
# Install as a service
navidrome svc install

# Start and verify status
navidrome svc start
navidrome svc status
```

{{% alert %}}
The `service` command is mainly intended for native OS service setups. In containerized deployments, lifecycle is typically managed by Docker/Compose/Kubernetes instead.
{{% /alert %}}

---

### `user`

Administer Navidrome users from the CLI.

```bash
navidrome user --help
```

Subcommands:

- `create` (alias: `c`)
- `delete` (alias: `d`)
- `edit` (alias: `e`)
- `list`

Examples:

```bash
# Create an admin user
navidrome user create --username alice --email alice@example.com --admin

# Edit user role
navidrome user edit --user alice --set-regular

# Update password interactively
navidrome user edit --user alice --set-password

# List users as JSON
navidrome user list --format json

# Delete user by username or ID
navidrome user delete --user alice
```

---

### `plugin`

Manage and inspect plugins from the CLI.

```bash
navidrome plugin --help
```

Subcommands:

- `list`: List installed plugins
- `info`: Show details for an installed plugin or a `.ndp` package
- `validate`: Validate an installed plugin or a `.ndp` package manifest
- `enable`: Enable a plugin
- `disable`: Disable a plugin
- `edit`: Update a plugin's config and/or permissions
- `rescan`: Re-discover plugins in the plugins folder

`info` and `validate` accept either an installed plugin ID or a path to a `.ndp` package file (an argument ending in `.ndp` is treated as a file).

Useful flags:

- `list`: `-f, --format` (`table`, `csv`, or `json`; default `table`)
- `info`: `-f, --format` (`text` or `json`; default `text`)
- `edit` (provide at least one; paired flags are mutually exclusive):
  - `--config` *(JSON string)* / `--config-file` *(path; use `-` to read from stdin)*
  - `--users` *(comma-separated or JSON array of usernames)* / `--all-users`
  - `--libraries` *(comma-separated or JSON array of integer library IDs)* / `--all-libraries`
  - `--write-access` / `--no-write-access`

Examples:

```bash
# List installed plugins as JSON
navidrome plugin list -f json

# Inspect a downloaded package before installing it
navidrome plugin info ./my-plugin-1.2.0.ndp

# Validate an installed plugin's manifest and config
navidrome plugin validate my-plugin

# Enable / disable a plugin
navidrome plugin enable my-plugin
navidrome plugin disable my-plugin

# Set a plugin's configuration
navidrome plugin edit my-plugin --config '{"apiKey":"abc123"}'

# Read configuration from stdin
cat config.json | navidrome plugin edit my-plugin --config-file -

# Grant access to all users and allow write access
navidrome plugin edit my-plugin --all-users --write-access

# Re-discover plugins after copying a new .ndp into the plugins folder
navidrome plugin rescan
```

{{% alert %}}
These commands require the plugin system to be enabled (`Plugins.Enabled`, on by default), and `rescan` requires `Plugins.Folder` to be set. See [Plugins](/docs/usage/features/plugins/) for a full overview of the plugin system and web-UI management.
{{% /alert %}}

## Notes and best practices

- Use `--help` frequently: command options can evolve between releases.
- Prefer explicit `--configfile` when running administrative commands in scripts.
- For destructive operations (`backup restore`, aggressive `backup prune`), verify paths and make an extra copy first.
