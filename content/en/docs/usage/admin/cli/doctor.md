---
title: "navidrome doctor"
linkTitle: "doctor"
date: 2026-09-13
weight: 30
description: >
  Check the database for problems
---

The `doctor` command checks the database for problems. It only reads the database and never changes
your data. Run it when Navidrome logs errors such as `database disk image is malformed`, or when
every scan fails.

## Usage

```bash
navidrome doctor
```

## Flags

`doctor` has no flags of its own. It accepts the [global flags](/docs/usage/admin/cli/#global-flags).

## Examples

```bash
# Check the database
navidrome doctor

# Stop a script when the database has problems
navidrome doctor || exit 1

# Check the database with Docker Compose
docker compose run --rm navidrome doctor
```

## What it checks

`doctor` runs two checks.

- **Integrity check.** Looks for corruption in the database file. If the damage is only in the
  search index, `doctor` tells you to run [`navidrome search rebuild`](/docs/usage/admin/cli/search/).
  Damage anywhere else can't be fixed automatically. Restore a backup with
  [`navidrome backup restore`](/docs/usage/admin/cli/backup/#backup-restore), or try SQLite's
  `.recover` command.
- **Foreign key check.** Looks for orphaned rows, which point to rows that no longer exist. This is
  not corruption. `navidrome scan -f` clears some of them in library data, and you have to delete
  the rest by hand.

The integrity check stops after a fixed number of problems. When it hits that limit, the damage may
be bigger than the list shows, and `doctor` won't suggest a search index rebuild.

## Output

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
