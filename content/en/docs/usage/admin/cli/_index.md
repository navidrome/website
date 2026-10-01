---
title: "Command-Line Interface (CLI)"
linkTitle: "CLI"
date: 2026-04-19
weight: 15
description: >
  Reference for the Navidrome command-line commands
---

Navidrome has a built-in CLI for administration, maintenance, and troubleshooting. Each command has
its own page. This page covers what the commands share.

## Quick start

Show the list of commands:

```bash
navidrome --help
```

Show help for one command or subcommand:

```bash
navidrome <command> --help
navidrome <command> <subcommand> --help
```

If you run `navidrome` with no command, it starts the server.

## Commands

| Command                                     | What it does                                           |
| ------------------------------------------- | ------------------------------------------------------ |
| [`artwork`](/docs/usage/admin/cli/artwork/) | Inspect artwork and resolve it again                   |
| [`backup`](/docs/usage/admin/cli/backup/)   | Create, prune, and restore database backups            |
| [`doctor`](/docs/usage/admin/cli/doctor/)   | Check the database for problems                        |
| [`inspect`](/docs/usage/admin/cli/inspect/) | Print the tags of music files as Navidrome reads them  |
| [`missing`](/docs/usage/admin/cli/missing/) | List missing files and remap them onto existing files  |
| [`plugin`](/docs/usage/admin/cli/plugin/)   | List, configure, enable, and disable plugins           |
| [`pls`](/docs/usage/admin/cli/pls/)         | List, export, and import playlists                     |
| [`scan`](/docs/usage/admin/cli/scan/)       | Scan the music library                                 |
| [`search`](/docs/usage/admin/cli/search/)   | Rebuild the full-text search index                     |
| [`service`](/docs/usage/admin/cli/service/) | Install and control Navidrome as an OS service         |
| [`user`](/docs/usage/admin/cli/user/)       | Create, edit, list, and delete users                   |

## Global flags

Every command accepts these flags.

| Flag               | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `-c, --configfile` | Config file to load. Default is `./navidrome.toml`                                       |
| `-n, --nobanner`   | Don't print the startup banner                                                           |
| `--musicfolder`    | Folder with your music                                                                   |
| `--datafolder`     | Folder for application data, such as the database. Navidrome needs write access to it    |
| `--cachefolder`    | Folder for cache data, such as transcoded audio and images. Navidrome needs write access |
| `-l, --loglevel`   | Log level. One of `error`, `info`, `debug`, or `trace`                                   |
| `--logfile`        | File to write logs to. Without it, Navidrome logs to stderr                              |

Commands read the same config file and `ND_` environment variables as the server. Run them with the
same settings as your server, or they will look at a different database. The server also takes
flags such as `--port` and `--address`. Run `navidrome --help` to see them, and see
[Configuration Options](/docs/usage/configuration/options/) for every setting.

```bash
navidrome -c /etc/navidrome/navidrome.toml --nobanner user list
```

## Running the CLI in Docker

If Navidrome runs in a container, run CLI commands in a container too. That way they use the same
`/data`, `/music`, config file, and environment variables as your server.

### Docker Compose

Use `docker compose run` with the name of your Navidrome service. It is usually `navidrome`:

```bash
# Show CLI help
docker compose run --rm navidrome --help

# Run a full scan
docker compose run --rm navidrome scan --full

# List users
docker compose run --rm navidrome user list
```

To run a command in the container that is already running, use `docker compose exec`. Put the
`navidrome` binary name before the command:

```bash
docker compose exec navidrome navidrome user list
```

### Docker run

Start a one-off container with the same image tag, volumes, and environment variables as your main
Navidrome container:

```bash
docker run --rm -it \
  --user $(id -u):$(id -g) \
  -v /path/to/music:/music:ro \
  -v /path/to/data:/data \
  --env-file /path/to/navidrome.env \
  -e ND_CONFIGFILE=/data/navidrome.toml \
  deluan/navidrome:latest \
  user list
```

`-it` gives the command a terminal. Commands that ask for input need it, such as `user create`,
which asks for a password.

## Notes and best practices

- Flags change between releases. Run `--help` to see the flags of the version you have.
- In scripts, pass `--configfile` so the command reads the config you expect.
- Stop Navidrome before you run [`backup restore`](/docs/usage/admin/cli/backup/#backup-restore) or
  [`search rebuild`](/docs/usage/admin/cli/search/#search-rebuild).
- `backup restore`, `backup prune`, and `missing fix` can't be undone. Check the paths and IDs you
  pass, and run `navidrome backup create` first.
