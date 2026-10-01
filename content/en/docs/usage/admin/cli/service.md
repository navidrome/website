---
title: "navidrome service"
linkTitle: "service"
date: 2026-09-13
weight: 100
description: >
  Install and control Navidrome as an OS service
---

The `service` commands install Navidrome as a service in your OS service manager, then start, stop,
and check it. The service manager is systemd on most Linux systems, launchd on macOS, and the
Service Control Manager on Windows. `navidrome service --help` shows the one your system uses.

The installation guides for [Linux](/docs/installation/linux/), [macOS](/docs/installation/macos/),
and [Windows](/docs/installation/windows/) show the full setup.

## Usage

```bash
navidrome service <subcommand> [flags]
```

The alias `svc` works too, so `navidrome svc status` is the same as `navidrome service status`.

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Subcommands

| Subcommand                       | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| [`install`](#service-install)     | Install Navidrome as a service                       |
| [`uninstall`](#service-uninstall) | Remove the service                                   |
| [`start`](#service-start)         | Start the service                                    |
| [`stop`](#service-stop)           | Stop the service                                     |
| [`status`](#service-status)       | Show whether the service is running                  |
| [`execute`](#service-execute)     | Run Navidrome in the foreground, as the service manager does |

### `service install`

Installs Navidrome as a system service. Before it installs, it prints the working directory, music
folder, data folder, and log location the service will use. You usually need root or Administrator
rights to install a service.

```bash
navidrome service install [-u <user>] [-w <folder>] [-c <config file>]
```

If you pass `--configfile`, the service uses that config file. Without it, the service looks for
`navidrome.toml` in its working directory. The service manager restarts Navidrome if it fails.
Logs go to the data folder, unless you set `LogFile`.

On Linux, the systemd unit also reads environment variables from `/etc/sysconfig/navidrome` if that
file exists.

#### Flags

| Flag                      | Default                         | Description                          |
| ------------------------- | ------------------------------- | ------------------------------------ |
| `-u, --user`              |                                 | OS user that runs the service        |
| `-w, --working-directory` | Folder of the `navidrome` binary | Working directory of the service     |

#### Examples

```bash
# Install the service with a config file, run by the navidrome user
sudo navidrome service install --user navidrome --configfile /etc/navidrome/navidrome.toml

# Install with a different working directory
sudo navidrome svc install --working-directory /var/lib/navidrome
```

### `service uninstall`

Removes the service from the service manager. Your music and data folders stay as they are.

```bash
navidrome service uninstall
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
sudo navidrome svc uninstall
```

### `service start`

Starts the service.

```bash
navidrome service start
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
sudo navidrome svc start
```

### `service stop`

Stops the service. Navidrome gets 10 seconds to shut down cleanly.

```bash
navidrome service stop
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
sudo navidrome svc stop
```

### `service status`

Prints whether the service is `Running`, `Stopped`, or `Unknown`.

```bash
navidrome service status
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
navidrome svc status
```

### `service execute`

Runs Navidrome in the foreground as a service. The service manager runs this command to start
Navidrome, so you don't need it. To run Navidrome in the foreground yourself, run `navidrome`.

```bash
navidrome service execute
```

#### Flags

This subcommand has no flags.

{{% alert %}}
The `service` command is for native installs. In Docker, Compose, or Kubernetes, the container
platform starts and stops Navidrome.
{{% /alert %}}
