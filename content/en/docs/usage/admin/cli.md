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

The built-in top-level administrative commands are: `inspect`, `scan`, `missing`, `artwork`, `backup`, `doctor`, `search`, `pls`, `service`, `user`, and `plugin`.

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

### `artwork`

Inspect artwork and resolve it again. These commands tell you why a cover is wrong or an artist
image is missing, without opening the database.

```bash
navidrome artwork --help
```

Subcommands:

- `status`: Queue size, where artwork comes from, how many items have no image, and whether artwork settings changed
- `explain`: Why one item got the artwork it has
- `refresh`: Clear one item's artwork state and queue it again
- `reprocess`: Queue artwork in bulk, by kind or by current source
- `cancel`: Remove pending artwork work in bulk, by kind or by queue priority

Each kind of artwork has a short code:

| Code | Kind       | `explain` | `refresh` | `reprocess` | `cancel` |
| ---- | ---------- | :-------: | :-------: | :---------: | :------: |
| `ar` | Artist     |     ✓     |     ✓     |      ✓      |    ✓     |
| `al` | Album      |     ✓     |     ✓     |      ✓      |    ✓     |
| `pl` | Playlist   |     ✓     |     ✓     |      ✓      |    ✓     |
| `ra` | Radio      |     ✓     |     ✓     |      ✓      |    ✓     |
| `mf` | Media file |     ✓     |     ✓     |             |    ✓     |
| `dc` | Disc       |     ✓     |           |             |          |

`reprocess` skips media files. A track's artwork comes only from its embedded tags, and Navidrome
reads them at scan time or the first time someone views the track. Media files still end up in the
queue, so `cancel` can remove them. Disc artwork has no stored state. Navidrome resolves it on every
request and caches the result by content, so `refresh` has nothing to clear. `explain` accepts
playlists and radios and shows their stored state and queue row, but they have no priority chain to
walk.

#### `artwork status`

```bash
navidrome artwork status
```

Shows the queue by kind and priority, how many items use each source, how many items have no image,
and whether artwork settings changed since the last full reprocess.

The `Absent` block splits items with no image in two. `NO IMAGE` counts items where every candidate
answered and none had an image. `FAILED` counts items where Navidrome ran out of retries, for example
because a provider kept timing out. Those are the best candidates for another try. Navidrome retries
neither group by itself. `artwork reprocess --source absent` retries both, and `--source failed`
retries only the ones that gave up.

```
Absent (resolved, no image found)
  KIND      NO IMAGE  FAILED
  artist    212       37
  album     48        0
```

The `Config` block compares a fingerprint of six settings: `CoverArtPriority`, `ArtistArtPriority`,
`ArtistImageFolder`, `Agents`, `EnableExternalServices`, and `EnableM3UExternalAlbumArt`. Changing
one of them does **not** update artwork that is already stored. Stored artwork keeps what the old
settings found, and Navidrome logs a warning at startup. Run `artwork reprocess --all` to apply the
new settings to the whole library. A full reprocess with no filters also saves the new fingerprint,
and the warning goes away.

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

You can name the item three ways. Use a bare id, a full artwork id such as `al-<id>`, or a
`<kind> <id>` pair. For a bare id, Navidrome looks up the kind itself, so artists, albums,
playlists, radios, and media files don't need `<kind>`. Discs have no table to look up, so a disc
always needs its kind. The disc example is further down.

The output has the item's stored artwork state, its queue row, the settings that decide its artwork,
and the priority chain. The chain shows which candidate won and why each one above it lost.

By default, `explain` prints the chain the server recorded the last time it resolved the item. That
is what really happened, and reading it costs no new lookups. The header shows when it was recorded.
`--live` walks the chain again right now, and the header reads `Chain (walked now)`. Discs have no
stored state, so `explain` always walks a disc's chain on the spot.

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

The `Chain` table uses these outcomes:

| Outcome      | Meaning                                                           |
| ------------ | ----------------------------------------------------------------- |
| `hit`        | This candidate produced the image                                 |
| `miss`       | Navidrome looked and found nothing                                |
| `unreadable` | A file exists, but Navidrome could not open or decode it          |
| `skipped`    | Navidrome never tried this candidate. `DETAIL` says why           |
| `error`      | A lookup or processing step failed. `DETAIL` has the error        |

Watch for `unreadable`. It points to a damaged file you can fix, while `miss` means nothing was
there. Stored state alone can't tell the two apart.

When resolution fails, the `Queue` block shows why. While Navidrome is still retrying,
`Last attempt failed` lists the steps of the latest attempt. After it stops retrying, `Gave up after`
lists the steps of the final one. If Navidrome found a candidate but could not process it, or an
external lookup failed, `Result` says `indeterminate` rather than `not resolved`. Nothing proved
the item has no artwork, and a retry may still find some.

Older Navidrome versions did not record chains, and `explain` tells you when an item was resolved
before recording started. Run it with `--live` to see the chain. A live run is also worth comparing
against `Stored`. If stored says `external:lastfm` and the live walk resolves from `folder`, the
stored state is stale. Run `artwork refresh` to fix it.

A disc artwork id is the album id and the disc number, joined by a colon:

```bash
navidrome artwork explain dc 6XTD9naRGpIrZLoA99pH1r:2
```

{{% alert %}}
By default `explain` makes no external requests, because it reads the recorded chain. `--live` walks
the chain with real lookups. This matters most when you are debugging rate limiting, since a
diagnostic run shouldn't add to the load on the provider.

`explain` for artists and albums, and `reprocess` for its lookup estimate, load the plugins named in
`Agents`. They load only those, because a plugin that isn't a configured agent can't supply an
image. Loading a plugin creates the services its manifest asks for, such as a key-value store.
Plugins load but don't start unless you pass `explain --live`. With it, each plugin runs its
initialization, which may open external connections.
{{% /alert %}}

#### `artwork refresh`

```bash
navidrome artwork refresh [<kind>] <id>...
```

Clears the stored artwork state for each item and queues it at the highest priority. Admins can do
the same for one album or artist in the web UI, with **Refresh Metadata** in the context menu.

Ids work the same as in `explain`. Use bare ids, full artwork ids like `al-<id>`, or one `<kind>`
followed by several ids of that kind. Bare and full ids carry their own kind, so you can mix kinds in
one call. If Navidrome can't find an id, it reports the id, skips it, and refreshes the rest.

The old state is gone, so the item shows a placeholder until Navidrome resolves it again.

```bash
navidrome artwork refresh 6XTD9naRGpIrZLoA99pH1r
navidrome artwork refresh al-6XTD9naRGpIrZLoA99pH1r ar-1dfeR4HaWDbWqFHLkxsg1d
navidrome artwork refresh al 1dfeR4HaWDbWqFHLkxsg1d 6XTD9naRGpIrZLoA99pH1r
```

#### `artwork reprocess`

```bash
navidrome artwork reprocess [--kind ...] [--source ...] [--all] [--dry-run] [-y]
```

Queues artwork in bulk. Flags:

- `--kind`: Kinds to reprocess (`ar`, `al`, `pl`, `ra`). Repeatable
- `--source`: Only items that currently resolve from these sources, such as `folder`, `embedded`,
  `external:lastfm`, `absent`, or `failed` for absent items that gave up. Repeatable
- `--all`: Reprocess every kind
- `--dry-run`: Show what would be queued, then exit without queueing
- `-y, --yes`: Skip the confirmation prompt

You must pass `--kind`, `--source`, or `--all`. Without one, the command fails, so you can't
re-resolve the whole library by accident. `--source` alone covers every kind. If you name a source
that no item uses, the command fails and lists the sources in use. Before it queues anything, the
command prints a breakdown and an estimate of external lookups, then asks you to confirm.

`reprocess` is the only way to retry absent artwork. Navidrome never goes back to an item with no
image by itself. It is also how you apply an artwork setting change to the whole library. See
[`artwork status`](#artwork-status).

```bash
# Preview artists that currently use Last.fm images
navidrome artwork reprocess --kind ar --source external:lastfm --dry-run

# Retry only the items that gave up, for example after a provider outage
navidrome artwork reprocess --source failed

# Retry every item that has no image
navidrome artwork reprocess --source absent

# Apply a changed artwork setting to the whole library
navidrome artwork reprocess --all
```

{{% alert color="warning" title="Important" %}}
Unlike `refresh`, `reprocess` does not clear existing artwork first. Images stay in place until new
ones replace them. It can still send a lot of external requests, so run it with `--dry-run` first
and read the estimate.
{{% /alert %}}

A running server works through queued items in the background. A stopped server starts on them at
its next startup. See [Artwork resolution](/docs/usage/library/artwork/) for how the priority chains
work.

#### `artwork cancel`

```bash
navidrome artwork cancel [--kind ...] [--priority ...] [--all] [--dry-run] [-y]
```

Removes pending artwork work from the queue. `reprocess` fills the queue, and `cancel` empties it.
Flags:

- `--kind`: Kinds to cancel (`ar`, `al`, `pl`, `ra`, `mf`). Repeatable
- `--priority`: Only rows queued at these priorities (`bump`, `scan`, `backfill`, `recheck`).
  Repeatable
- `--all`: Cancel every kind at every priority
- `--dry-run`: Show what would be cancelled, then exit without cancelling
- `-y, --yes`: Skip the confirmation prompt

You must pass `--kind`, `--priority`, or `--all`. Like `reprocess`, the command prints a breakdown
and asks you to confirm before it deletes anything.

Use `--priority` to call off a bulk job and keep everything else. `reprocess` queues items at
`recheck` priority, and on a large library that can mean tens of thousands of external lookups.
Cancel `recheck` to stop that job. Items you refreshed by hand sit at `bump`, so they stay queued.

Queue priorities, highest first:

| Priority   | Queued by                                                                     |
| ---------- | ----------------------------------------------------------------------------- |
| `bump`     | `artwork refresh`, a request for an item with no artwork state, or saving a radio |
| `scan`     | The scanner, for items it added or changed                                    |
| `backfill` | Nothing in current versions. You can still cancel rows an older version queued |
| `recheck`  | `artwork reprocess`, and the hourly check for items with no artwork state     |

```bash
# See what is queued at recheck priority
navidrome artwork cancel --priority recheck --dry-run

# Call off a bulk reprocess and keep manual refreshes queued
navidrome artwork cancel --priority recheck

# Empty the queue
navidrome artwork cancel --all --yes
```

{{% alert color="warning" title="Important" %}}
`cancel` only touches the queue. It leaves resolved artwork and the state `explain` reports alone.
The worker keeps running, and items the server already picked up still finish. The hourly check can
queue an item with no artwork state again, so a cancel lasts longest for items that already have
artwork. The command applies the selection again when you confirm, so it also cancels anything
queued after the preview.
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

### `doctor`

Check the database for problems. `doctor` only reads the database and never changes your data.

```bash
navidrome doctor
```

Run it when Navidrome logs errors such as `database disk image is malformed`, or when every scan
fails. It runs two checks:

- **Integrity check.** Looks for corruption in the database file. If the damage is only in the
  search index, `doctor` tells you to run [`navidrome search rebuild`](#search-rebuild). Damage
  anywhere else can't be fixed automatically. Restore a backup with `navidrome backup restore`, or
  try SQLite's `.recover` command.
- **Foreign key check.** Looks for orphaned rows, which point to rows that no longer exist. This is
  not corruption. `navidrome scan -f` clears some of them in library data, and you have to delete
  the rest by hand.

The integrity check stops after a fixed number of problems. When it hits that limit, the damage may
be bigger than the list shows, and `doctor` won't suggest a search index rebuild.

A healthy database looks like this:

```
Checking database integrity...
Integrity check passed.
Checking foreign keys...
Foreign key check passed.
Database is healthy.
```

`doctor` exits with status 1 when a check finds a problem or can't finish, so you can use it in
scripts.

---

### `search`

Maintain the full-text search index.

```bash
navidrome search --help
```

Subcommands:

- `rebuild`: Delete the search index and build it again from the library data

#### `search rebuild`

```bash
navidrome search rebuild [-f]
```

Deletes the full-text search index and builds it again from your library data. The index only holds
copies of data stored elsewhere in the database, so you lose nothing. Navidrome checks the new index
before it saves it.

Use it in two cases:

- `navidrome doctor` reports that the corruption is limited to the search index.
- Search misses items that are in your library. `doctor` can't detect an index that is out of sync
  but not corrupt, so a rebuild is the thing to try.

Flags:

- `-f, --force`: Skip the confirmation prompt

Without `--force`, the command asks you to type `YES` to continue.

{{% alert color="warning" title="Important" %}}
`navidrome search rebuild` must be run while Navidrome is **not running**.
{{% /alert %}}

Examples:

```bash
# Check the database, then rebuild a corrupted search index
navidrome doctor
navidrome search rebuild

# With Docker Compose, stop the server first
docker compose stop navidrome
docker compose run --rm navidrome search rebuild
docker compose start navidrome
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
