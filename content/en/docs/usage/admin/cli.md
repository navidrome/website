---
title: "Command-Line Interface (CLI)"
linkTitle: "CLI"
date: 2026-04-19
weight: 15
description: >
  Reference for Navidrome command-line commands and common workflows
---

Navidrome includes a built-in CLI for administration tasks, maintenance, and troubleshooting.

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

### `backup` (alias: `bkp`)

Manage database backups.

```bash
navidrome backup --help
```

Subcommands:

- `navidrome backup create`
- `navidrome backup prune`
- `navidrome backup restore`

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
The `service` command is mainly intended for native OS service setups. In containerized deployments, lifecycle is usually managed by Docker/Compose/Kubernetes instead.
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

## Notes and best practices

- Use `--help` frequently: command options can evolve between releases.
- Prefer explicit `--configfile` when running administrative commands in scripts.
- For destructive operations (`backup restore`, aggressive `backup prune`), verify paths and make an extra copy first.
