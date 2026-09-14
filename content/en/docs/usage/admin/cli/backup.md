---
title: "navidrome backup"
linkTitle: "backup"
date: 2026-09-13
weight: 20
description: >
  Create, prune, and restore database backups
---

The `backup` commands make a copy of the Navidrome database, delete old copies, and restore a copy.
Navidrome can also make backups on a schedule. See [Automated Backup](/docs/usage/admin/backup/).

Backups go to the folder in the `Backup.Path` setting. Each backup file has a name like
`navidrome_backup_2026.04.01_04.00.00.db`, with the date and time it was made.

## Usage

```bash
navidrome backup <subcommand> [flags]
```

The alias `bkp` works too, so `navidrome bkp create` is the same as `navidrome backup create`.

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Subcommands

| Subcommand                   | Description                                  |
| ---------------------------- | -------------------------------------------- |
| [`create`](#backup-create)   | Make a backup of the database now            |
| [`prune`](#backup-prune)     | Delete old backups and keep the newest ones  |
| [`restore`](#backup-restore) | Replace the database with a backup           |

### `backup create`

Makes a backup of the database. This command doesn't delete old backups, even when you have more
than `Backup.Count`. Run `backup prune` for that.

```bash
navidrome backup create [-d <folder>]
```

#### Flags

| Flag               | Default       | Description              |
| ------------------ | ------------- | ------------------------ |
| `-d, --backup-dir` | `Backup.Path` | Folder to write the backup to |

#### Examples

```bash
# Back up to the folder in Backup.Path
navidrome backup create

# Back up to another folder
navidrome backup create --backup-dir /mnt/backups/navidrome
```

### `backup prune`

Deletes old backups and keeps the newest ones. It only looks at files named like
`navidrome_backup_<date>_<time>.db`, and leaves other files in the folder alone.

```bash
navidrome backup prune [-d <folder>] [-k <count>] [-f]
```

By default, prune keeps as many backups as `Backup.Count`. If the number to keep is `0`, prune
deletes every backup. It asks you to type `YES` first, unless you pass `--force`.

#### Flags

| Flag               | Default        | Description                                            |
| ------------------ | -------------- | ------------------------------------------------------ |
| `-d, --backup-dir` | `Backup.Path`  | Folder with the backups                                |
| `-k, --keep-count` | `Backup.Count` | Number of backups to keep. `0` deletes all backups     |
| `-f, --force`      | `false`        | Don't ask for confirmation when you delete all backups |

#### Examples

```bash
# Keep the number of backups set in Backup.Count
navidrome backup prune

# Keep only the newest 7 backups
navidrome backup prune --keep-count 7

# Delete all backups without a prompt
navidrome backup prune --keep-count 0 --force
```

### `backup restore`

Replaces the current database with a backup. It asks you to type `YES` first, unless you pass
`--force`.

```bash
navidrome backup restore --backup-file <file> [-f]
```

If `--backup-file` is a file name or a relative path, the command looks for it in the `Backup.Path`
folder. An absolute path works from anywhere.

#### Flags

| Flag                | Default | Description                                  |
| ------------------- | ------- | -------------------------------------------- |
| `-b, --backup-file` |         | Backup file to restore. Required             |
| `-f, --force`       | `false` | Skip the confirmation prompt                 |

#### Examples

```bash
# Restore a backup from the Backup.Path folder
navidrome backup restore --backup-file navidrome_backup_2026.04.01_04.00.00.db

# Restore a backup from another folder
navidrome backup restore --backup-file /mnt/backups/navidrome/navidrome_backup_2026.04.01_04.00.00.db

# With Docker Compose, stop the server first
docker compose stop navidrome
docker compose run --rm navidrome backup restore --backup-file navidrome_backup_2026.04.01_04.00.00.db
docker compose start navidrome
```

{{% alert color="warning" title="Important" %}}
Stop Navidrome before you run `navidrome backup restore`. Everything that changed after the backup
is lost, such as new users, play counts, and playlists.
{{% /alert %}}
