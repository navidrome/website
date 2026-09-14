---
title: "navidrome artwork"
linkTitle: "artwork"
date: 2026-09-13
weight: 10
description: >
  Inspect artwork and resolve it again
---

The `artwork` commands tell you why a cover is wrong or an artist image is missing, without opening
the database. They also queue artwork to resolve again, one item at a time or in bulk. See
[Artwork resolution](/docs/usage/library/artwork/) for how Navidrome picks an image.

## Usage

```bash
navidrome artwork <subcommand> [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Artwork kinds

Each kind of artwork has a short code. Not every subcommand accepts every kind.

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
queue, so `cancel` can remove them.

Disc artwork has no stored state. Navidrome resolves it on every request and caches the result by
content, so `refresh` has nothing to clear.

`explain` accepts playlists and radios. It shows their stored state and queue row, but they have no
priority chain to walk.

## Subcommands

| Subcommand                       | Description                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| [`status`](#artwork-status)       | Show the queue, where artwork comes from, items with no image, and the settings state     |
| [`explain`](#artwork-explain)     | Show why one item got the artwork it has                                                  |
| [`refresh`](#artwork-refresh)     | Clear the artwork state of some items and queue them again                                |
| [`reprocess`](#artwork-reprocess) | Queue artwork in bulk, by kind or by current source                                       |
| [`cancel`](#artwork-cancel)       | Remove pending artwork work in bulk, by kind or by queue priority                         |

### `artwork status`

Shows the queue by kind and priority, how many items use each source, how many items have no image,
and whether artwork settings changed since the last full reprocess.

```bash
navidrome artwork status
```

#### Flags

This subcommand has no flags.

#### Output

The `Absent` block splits items with no image in two. `NO IMAGE` counts items where every candidate
answered and none had an image. `FAILED` counts items where Navidrome ran out of retries, for example
because a provider kept timing out. Those are the best candidates for another try.

```
Absent (resolved, no image found)
  KIND      NO IMAGE  FAILED
  artist    212       37
  album     48        0
```

Navidrome retries neither group by itself. `artwork reprocess --source absent` retries both, and
`--source failed` retries only the ones that gave up.

The `Config` block compares a fingerprint of six settings: `CoverArtPriority`, `ArtistArtPriority`,
`ArtistImageFolder`, `Agents`, `EnableExternalServices`, and `EnableM3UExternalAlbumArt`.

```
Config
  State:                fingerprint changed — stored artwork keeps the old resolution; run 'artwork reprocess --all' to apply it
  Stored fingerprint:   7e537a22febc07d3
  Current fingerprint:  c49003a68a82ee68
  Fingerprint inputs (changing any of these makes the stored artwork stale):
    CoverArtPriority:           cover.*, folder.*, front.*, embedded, external
    ...
```

Changing one of these settings does **not** update artwork that is already stored. Stored artwork
keeps what the old settings found, and Navidrome logs a warning at startup. Run
`artwork reprocess --all` to apply the new settings to the whole library. A full reprocess with no
filters also saves the new fingerprint, and the warning goes away.

### `artwork explain`

Shows why one item got the artwork it has. The output has the item's stored artwork state, its queue
row, the settings that decide its artwork, and the priority chain. The chain shows which candidate
won and why each one above it lost.

```bash
navidrome artwork explain [<kind>] <id> [--live]
```

You can name the item three ways. Use a bare ID, a full artwork ID such as `al-<id>`, or a
`<kind> <id>` pair. For a bare ID, Navidrome looks up the kind itself, so artists, albums, playlists,
radios, and media files don't need `<kind>`. Discs have no table to look up, so a disc always needs
its kind. A disc artwork ID is the album ID and the disc number, joined by a colon.

By default, `explain` prints the chain the server recorded the last time it resolved the item. That
is what really happened, and reading it costs no new lookups. The header shows when Navidrome
recorded it. `--live` walks the chain again right now, and the header reads `Chain (walked now)`.
Discs have no stored state, so `explain` always walks a disc's chain on the spot.

#### Flags

| Flag     | Default | Description                                                                                                                                                      |
| -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--live` | `false` | Walk the chain again now, with real external lookups, instead of printing the recorded chain. Also starts plugin agents, which may open external connections |

#### Examples

```bash
# Explain an album by its bare ID
navidrome artwork explain 6XTD9naRGpIrZLoA99pH1r

# The same album, by its full artwork ID
navidrome artwork explain al-6XTD9naRGpIrZLoA99pH1r

# Walk the chain again now
navidrome artwork explain al 6XTD9naRGpIrZLoA99pH1r --live

# Explain disc 2 of an album
navidrome artwork explain dc 6XTD9naRGpIrZLoA99pH1r:2
```

#### Output

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

| Outcome      | Meaning                                                  |
| ------------ | -------------------------------------------------------- |
| `hit`        | This candidate produced the image                        |
| `miss`       | Navidrome looked and found nothing                       |
| `unreadable` | A file exists, but Navidrome could not open or decode it |
| `skipped`    | Navidrome never tried this candidate. `DETAIL` says why  |
| `error`      | A lookup or processing step failed. `DETAIL` has the error |

Watch for `unreadable`. It points to a damaged file you can fix, while `miss` means nothing was
there. Stored state alone can't tell the two apart.

When resolution fails, the `Queue` block shows why. While Navidrome is still retrying,
`Last attempt failed` lists the steps of the latest attempt. After it stops retrying,
`Gave up after` lists the steps of the final one. If Navidrome found a candidate but could not
process it, or an external lookup failed, `Result` says `indeterminate` rather than `not resolved`.
Nothing proved the item has no artwork, and a retry may still find some.

Older Navidrome versions did not record chains, and `explain` tells you when it resolved an item
before recording started. Run it with `--live` to see the chain. A live run is also worth comparing
against `Stored`. If stored says `external:lastfm` and the live walk resolves from `folder`, the
stored state is stale. Run `artwork refresh` to fix it.

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

### `artwork refresh`

Clears the stored artwork state of each item and queues it at the highest priority. Admins can do
the same for one album or artist in the web UI, with **Refresh Metadata** in the context menu.

```bash
navidrome artwork refresh [<kind>] <id>...
```

IDs work the same as in `explain`. Use bare IDs, full artwork IDs like `al-<id>`, or one `<kind>`
followed by several IDs of that kind. Bare and full IDs carry their own kind, so you can mix kinds in
one call. If Navidrome can't find an ID, it reports the ID, skips it, and refreshes the rest.

The old state is gone, so the item shows a placeholder until Navidrome resolves it again.

#### Flags

This subcommand has no flags.

#### Examples

```bash
# Refresh one album by its bare ID
navidrome artwork refresh 6XTD9naRGpIrZLoA99pH1r

# Refresh an album and an artist in one call
navidrome artwork refresh al-6XTD9naRGpIrZLoA99pH1r ar-1dfeR4HaWDbWqFHLkxsg1d

# Refresh two albums
navidrome artwork refresh al 1dfeR4HaWDbWqFHLkxsg1d 6XTD9naRGpIrZLoA99pH1r
```

### `artwork reprocess`

Queues artwork in bulk. `reprocess` is the only way to retry absent artwork, because Navidrome never
goes back to an item with no image by itself. It is also how you apply an artwork setting change to
the whole library. See [`artwork status`](#artwork-status).

```bash
navidrome artwork reprocess [--kind ...] [--source ...] [--all] [--dry-run] [-y]
```

You must pass `--kind`, `--source`, or `--all`. Without one, the command fails, so you can't
resolve the whole library again by accident. `--source` alone covers every kind. If you name a
source that no item uses, the command fails and lists the sources in use.

Before it queues anything, the command prints a breakdown and an estimate of external lookups, then
asks you to confirm. A running server works through queued items in the background. A stopped server
starts on them at its next startup.

#### Flags

| Flag        | Default | Description                                                                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--kind`    |         | Kinds to reprocess: `ar`, `al`, `pl`, `ra`. Repeatable                                                                      |
| `--source`  |         | Only items that resolve from these sources now, such as `folder`, `embedded`, `external:lastfm`, `absent`, or `failed`. Repeatable |
| `--all`     | `false` | Reprocess every kind                                                                                                         |
| `--dry-run` | `false` | Show what the command would queue, then exit without queueing                                                                |
| `-y, --yes` | `false` | Skip the confirmation prompt                                                                                                 |

`failed` selects absent items where Navidrome gave up after its retries.

#### Examples

```bash
# Preview artists that use Last.fm images now
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

### `artwork cancel`

Removes pending artwork work from the queue. `reprocess` fills the queue, and `cancel` empties it.

```bash
navidrome artwork cancel [--kind ...] [--priority ...] [--all] [--dry-run] [-y]
```

You must pass `--kind`, `--priority`, or `--all`. Like `reprocess`, the command prints a breakdown
and asks you to confirm before it deletes anything.

Use `--priority` to call off a bulk job and keep everything else. `reprocess` queues items at
`recheck` priority, and on a large library that can mean tens of thousands of external lookups.
Cancel `recheck` to stop that job. Items you refreshed by hand sit at `bump`, so they stay queued.

Queue priorities, highest first:

| Priority   | Queued by                                                                          |
| ---------- | ---------------------------------------------------------------------------------- |
| `bump`     | `artwork refresh`, a request for an item with no artwork state, or saving a radio  |
| `scan`     | The scanner, for items it added or changed                                         |
| `backfill` | Nothing in current versions. You can still cancel rows an older version queued     |
| `recheck`  | `artwork reprocess`, and the hourly check for items with no artwork state          |

#### Flags

| Flag         | Default | Description                                                          |
| ------------ | ------- | -------------------------------------------------------------------- |
| `--kind`     |         | Kinds to cancel: `ar`, `al`, `pl`, `ra`, `mf`. Repeatable            |
| `--priority` |         | Only rows queued at these priorities: `bump`, `scan`, `backfill`, `recheck`. Repeatable |
| `--all`      | `false` | Cancel every kind at every priority                                  |
| `--dry-run`  | `false` | Show what the command would cancel, then exit without cancelling     |
| `-y, --yes`  | `false` | Skip the confirmation prompt                                         |

#### Examples

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
