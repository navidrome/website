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

The built-in top-level administrative commands are: `inspect`, `scan`, `artwork`, `backup`, `pls`, `service`, `user`, and `plugin`.

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

### `artwork`

Inspect and re-resolve artwork. Use these commands to answer "why is this cover wrong?" or
"why is this artist image missing?" without querying the database directly.

```bash
navidrome artwork --help
```

Subcommands:

- `status`: Queue depth, where artwork currently resolves from, absent counts, and config state
- `explain`: Why a single item's artwork resolved the way it did
- `refresh`: Clear one item's artwork state and re-resolve it
- `reprocess`: Re-enqueue artwork in bulk, filtered by kind and/or current source
- `cancel`: Cancel pending artwork work in bulk, filtered by kind and/or queue priority

Artwork kinds are given by their short code:

| Code | Kind       | `explain` | `refresh` | `reprocess` | `cancel` |
| ---- | ---------- | :-------: | :-------: | :---------: | :------: |
| `ar` | Artist     |     ✓     |     ✓     |      ✓      |    ✓     |
| `al` | Album      |     ✓     |     ✓     |      ✓      |    ✓     |
| `pl` | Playlist   |     ✓     |     ✓     |      ✓      |    ✓     |
| `ra` | Radio      |     ✓     |     ✓     |      ✓      |    ✓     |
| `mf` | Media file |     ✓     |     ✓     |             |    ✓     |
| `dc` | Disc       |     ✓     |           |             |          |

Media files are not re-enqueued in bulk because they resolve from embedded tags only, at scan time
or on first view. They are still queued, though, so `cancel` applies. Disc artwork keeps no stored
state at all — it is resolved on every request and cached by content — so there is nothing for
`refresh` to clear. Playlists and radios are accepted by `explain`, which reports their stored state
and queue row, but they do not walk a priority chain.

#### `artwork status`

```bash
navidrome artwork status
```

Reports the artwork queue by kind and priority, the distribution of sources currently in use, how
many items resolved to no image, and whether the artwork configuration changed since the library was
last resolved.

The `Absent` block splits items with no image into two columns. `NO IMAGE` means every candidate was
asked and none had an image. `FAILED` means Navidrome gave up after its retries ran out, for example
because a provider kept timing out. Those are the items most likely to resolve on another try.
Navidrome never retries either group on its own; use `artwork reprocess --source absent` for both, or
`--source failed` for just the ones that gave up.

```
Absent (resolved, no image found)
  KIND      NO IMAGE  FAILED
  artist    212       37
  album     48        0
```

The `Config` block tracks an internal fingerprint of `CoverArtPriority`, `ArtistArtPriority`,
`ArtistImageFolder`, `Agents`, `EnableExternalServices`, and `EnableM3UExternalAlbumArt`. Changing any
of them does **not** re-resolve existing artwork: stored artwork keeps the result of the old settings,
and Navidrome logs a warning at startup. To apply the change to the whole library, run
`artwork reprocess --all`. A full, unfiltered reprocess also records the new fingerprint, which clears
the warning.

```
Config
  State:                fingerprint changed — stored artwork keeps the old resolution; run 'artwork reprocess --all' to apply it
  Stored fingerprint:   7e537a22febc07d3
  Current fingerprint:  c49003a68a82ee68
  Fingerprint inputs (changing any of these makes the stored artwork stale):
    CoverArtPriority:           cover.*, folder.*, front.*, embedded, external
    ...
```

#### `artwork explain`

```bash
navidrome artwork explain [<kind>] <id> [--live]
```

The item can be given three ways: a bare id, a full artwork id such as `al-<id>`, or an explicit
`<kind> <id>` pair. With a bare id Navidrome looks the id up to find its kind, so the `<kind>` prefix
is optional for artists, albums, playlists, radios, and media files. Disc artwork has no table to
look up, so a disc still needs its kind (see the disc example below).

Prints the item's stored artwork state, its queue row, the configuration that governs it, and the
walk of the priority chain — which candidate won, and why each one above it lost.

By default the chain is the one the server **recorded** the last time it resolved the item, so it
shows what actually happened, and no lookups are repeated. The header says when it was recorded.
With `--live`, `explain` walks the chain again right now instead, and the header reads
`Chain (walked now)`. Disc artwork keeps no stored state, so a disc is always walked now.

```
Item
  Kind:  album (al)
  ID:    6XTD9naRGpIrZLoA99pH1r
  Name:  OK Computer

Stored
  Source:        folder
  Hash:          fa90ba01c3d4e5f6
  Source path:   /music/Radiohead/OK Computer/cover.jpg
  Attempted at:  2026-04-19T03:22:11Z

Queue
  (not queued)

Config
  CoverArtPriority:  cover.*, folder.*, front.*, embedded, external
  Agents:            lastfm, spotify

Chain (recorded 2026-04-19T03:22:11Z)
  CANDIDATE  OUTCOME  DETAIL
  cover.*    hit      /music/Radiohead/OK Computer/cover.jpg

Result
  resolved from folder
```

Outcomes in the `Chain` table are:

| Outcome      | Meaning                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `hit`        | This candidate produced the image                                        |
| `miss`       | Looked, found nothing                                                    |
| `unreadable` | A file is there but could not be opened or decoded                       |
| `skipped`    | Never evaluated, with the reason in `DETAIL`                             |
| `error`      | A lookup or a processing step failed, with the error in `DETAIL`         |

`unreadable` versus `miss` is the distinction stored state alone cannot express: the first means a
damaged or unreadable file that is worth fixing, the second means there was simply nothing there.

When a resolution fails, the `Queue` block shows why. `Last attempt failed` lists the steps of the
most recent failed attempt while the item is still being retried. `Gave up after` lists the steps of
the final attempt once Navidrome stopped retrying. If a candidate was found but could not be
processed, or an external lookup failed, `Result` reads `indeterminate` instead of `not resolved`:
nothing proved that the item has no artwork, and a retry may find it.

Items resolved by an older Navidrome version have no recorded chain. For those, `explain` says so;
re-run it with `--live` to see the chain. Reading a live `Result` against `Stored` is itself
diagnostic. If they disagree — stored says `external:lastfm`, the live walk resolves from `folder` —
the stored state is stale, and `artwork refresh` is the fix.

A disc artwork id is the album id and the disc number joined by a colon:

```bash
navidrome artwork explain dc 6XTD9naRGpIrZLoA99pH1r:2
```

{{% alert %}}
`explain` makes **no external requests** by default: it reports the recorded chain instead of walking
it again. Pass `--live` to walk the chain now with real lookups. The default protects providers from
a diagnostic run adding load, especially when the reason you are debugging is rate limiting.

To report accurately, `explain` (for artists and albums) and `reprocess` (for its lookup estimate)
load the plugins named in `Agents` — and only those, since a plugin that is not a configured agent
cannot supply an image. Loading a plugin creates the services its manifest asks for, such as a
key-value store. `explain --live` additionally runs each plugin's initialization, which may open
external connections; without it, plugins are loaded but not started.
{{% /alert %}}

#### `artwork refresh`

```bash
navidrome artwork refresh [<kind>] <id>...
```

Clears the item's stored artwork state and re-queues it at high priority. For albums and artists,
admins can do the same from the web UI with **Refresh Metadata** in the context menu. Accepts
multiple ids.

Ids take the same forms as `explain`: a bare id, a full artwork id like `al-<id>`, or a shared
`<kind> <id>...` leader that applies one kind to every id. When you pass self-describing ids (bare
or `al-<id>` form) you can mix kinds in a single call. An id that cannot be resolved is reported and
skipped, and the remaining ids are still refreshed.

Because the state is cleared, the item shows a placeholder until it is resolved again.

```bash
navidrome artwork refresh 6XTD9naRGpIrZLoA99pH1r
navidrome artwork refresh al-6XTD9naRGpIrZLoA99pH1r ar-1dfeR4HaWDbWqFHLkxsg1d
navidrome artwork refresh al 1dfeR4HaWDbWqFHLkxsg1d 6XTD9naRGpIrZLoA99pH1r
```

#### `artwork reprocess`

```bash
navidrome artwork reprocess [--kind ...] [--source ...] [--all] [--dry-run] [-y]
```

Re-enqueues artwork in bulk. Flags:

- `--kind`: Kinds to reprocess (`ar`, `al`, `pl`, `ra`); repeatable
- `--source`: Only items currently resolved from these sources (e.g. `folder`, `embedded`,
  `external:lastfm`, `absent`, or `failed` for the absent items that gave up); repeatable
- `--all`: Reprocess every kind
- `--dry-run`: Report what would be queued and exit without queueing
- `-y, --yes`: Skip the confirmation prompt

At least one of `--kind`, `--source`, or `--all` is required — an unfiltered run is an error, not a
silent full re-resolve. `--source` on its own applies to every kind. A source that no item uses is
an error, and the message lists the sources in use. Before queueing, the command prints a breakdown
and an estimate of the external lookups involved, then asks for confirmation.

`reprocess` is the only way absent artwork is retried: Navidrome does not revisit an item with no
image on its own. It is also how you apply an artwork configuration change to the whole library (see
[`artwork status`](#artwork-status)).

```bash
# What would be re-resolved for artists currently sourced from an external agent?
navidrome artwork reprocess --kind ar --source external:lastfm --dry-run

# Retry only the items that gave up, for example after a provider outage
navidrome artwork reprocess --source failed

# Retry everything that resolved to no image at all
navidrome artwork reprocess --source absent

# Apply a changed artwork setting to the whole library
navidrome artwork reprocess --all
```

{{% alert color="warning" title="Important" %}}
Unlike `refresh`, `reprocess` does **not** clear existing artwork first, so images stay in place
until they are replaced. It can still generate a large number of external requests — use
`--dry-run` first and read the estimate.
{{% /alert %}}

Enqueued items are picked up by a running server on its next drain, or at next startup if the
server is stopped. See [Artwork resolution](/docs/usage/library/artwork/) for how the priority
chains themselves work.

#### `artwork cancel`

```bash
navidrome artwork cancel [--kind ...] [--priority ...] [--all] [--dry-run] [-y]
```

Cancels pending artwork work. It is the counterpart to `reprocess`: one fills the queue, the other
empties it. Flags:

- `--kind`: Kinds to cancel (`ar`, `al`, `pl`, `ra`, `mf`); repeatable
- `--priority`: Only rows queued at these priorities (`bump`, `scan`, `backfill`, `recheck`);
  repeatable
- `--all`: Cancel every kind at every priority
- `--dry-run`: Report what would be cancelled and exit without cancelling
- `-y, --yes`: Skip the confirmation prompt

At least one of `--kind`, `--priority`, or `--all` is required. As with `reprocess`, the command
prints a breakdown and asks for confirmation before it deletes anything.

Filtering by priority lets you call off a bulk job and keep the rest. A large `reprocess` queues its
items at `recheck` priority, which on a large library can mean tens of thousands of external
lookups. Cancelling that priority calls off the bulk job and leaves the items you asked for by hand,
which sit at `bump`.

Queue priorities, highest first:

| Priority   | Queued by                                                                        |
| ---------- | -------------------------------------------------------------------------------- |
| `bump`     | `artwork refresh`, a request for an item with no artwork state, or a radio save  |
| `scan`     | The scanner, for items it added or changed                                       |
| `backfill` | Nothing in current versions; rows left by an older version can still be cancelled |
| `recheck`  | `artwork reprocess`, and the hourly check for items with no artwork state        |

```bash
# What is sitting at recheck priority right now?
navidrome artwork cancel --priority recheck --dry-run

# Call off a bulk reprocess, keeping manual refreshes queued
navidrome artwork cancel --priority recheck

# Empty the queue completely
navidrome artwork cancel --all --yes
```

{{% alert color="warning" title="Important" %}}
`cancel` empties the queue and nothing else. Resolved artwork and the state `explain` reports are
left alone. It does not stop the worker, and it does not interrupt items the server has already
picked up. An item that has no artwork state yet can be queued again by the hourly check, so
cancelling is most durable for items that already have artwork. The selection is applied again when
you confirm, so anything queued after the preview is cancelled too.
{{% /alert %}}

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
