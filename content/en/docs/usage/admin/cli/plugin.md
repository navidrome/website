---
title: "navidrome plugin"
linkTitle: "plugin"
date: 2026-09-13
weight: 60
description: >
  List, configure, enable, and disable plugins
---

The `plugin` commands list, check, configure, enable, and disable plugins. They do the same things as
the plugin screens in the web UI. See [Plugins](/docs/usage/features/plugins/) for how the plugin
system works.

## Usage

```bash
navidrome plugin <subcommand> [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

These commands need the plugin system enabled. `Plugins.Enabled` is on by default.

## Subcommands

| Subcommand                    | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| [`list`](#plugin-list)         | List installed plugins                                   |
| [`info`](#plugin-info)         | Show details for an installed plugin or a `.ndp` package |
| [`validate`](#plugin-validate) | Check the manifest of an installed plugin or a `.ndp` package |
| [`enable`](#plugin-enable)     | Enable a plugin                                          |
| [`disable`](#plugin-disable)   | Disable a plugin                                         |
| [`edit`](#plugin-edit)         | Change a plugin's config, permissions, or both           |
| [`rescan`](#plugin-rescan)     | Find plugins added to or removed from the plugins folder |

### `plugin list`

Lists installed plugins.

```bash
navidrome plugin list [-f table|csv|json]
```

#### Flags

| Flag           | Default | Description                                  |
| -------------- | ------- | -------------------------------------------- |
| `-f, --format` | `table` | Output format. One of `table`, `csv`, `json` |

#### Examples

```bash
# List installed plugins as a table
navidrome plugin list

# List installed plugins as JSON
navidrome plugin list -f json
```

### `plugin info`

Shows details for an installed plugin or a `.ndp` package file. An argument that ends in `.ndp` is a
package file. Anything else is the ID of an installed plugin.

```bash
navidrome plugin info <id|file.ndp> [-f text|json]
```

#### Flags

| Flag           | Default | Description                         |
| -------------- | ------- | ----------------------------------- |
| `-f, --format` | `text`  | Output format. One of `text`, `json` |

#### Examples

```bash
# Show details for an installed plugin
navidrome plugin info my-plugin

# Check a downloaded package before you install it
navidrome plugin info ./my-plugin-1.2.0.ndp
```

### `plugin validate`

Checks the manifest of an installed plugin or a `.ndp` package file. It reads the argument the same
way as `info`.

```bash
navidrome plugin validate <id|file.ndp>
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
# Check an installed plugin
navidrome plugin validate my-plugin

# Check a package file
navidrome plugin validate ./my-plugin-1.2.0.ndp
```

### `plugin enable`

Enables an installed plugin.

```bash
navidrome plugin enable <id>
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
navidrome plugin enable my-plugin
```

### `plugin disable`

Disables an installed plugin.

```bash
navidrome plugin disable <id>
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
navidrome plugin disable my-plugin
```

### `plugin edit`

Changes a plugin's config, the users and libraries it can access, and whether it can write to
libraries. Pass at least one flag. The flags come in pairs, and you can't use both flags of a pair
in one call.

```bash
navidrome plugin edit <id> [flags]
```

#### Flags

| Flag                | Default | Description                                                                 |
| ------------------- | ------- | --------------------------------------------------------------------------- |
| `--config`          |         | Plugin config as a JSON string                                              |
| `--config-file`     |         | File to read the plugin config JSON from. Use `-` to read from stdin        |
| `--users`           |         | Usernames the plugin can access, as `alice,bob` or `["alice","bob"]`        |
| `--all-users`       | `false` | Give the plugin access to all users                                         |
| `--libraries`       |         | Library IDs the plugin can access, as `1,2` or `[1,2]`                      |
| `--all-libraries`   | `false` | Give the plugin access to all libraries                                     |
| `--write-access`    | `false` | Let the plugin write to libraries                                           |
| `--no-write-access` | `false` | Don't let the plugin write to libraries                                     |

The pairs are `--config` and `--config-file`, `--users` and `--all-users`, `--libraries` and
`--all-libraries`, and `--write-access` and `--no-write-access`.

#### Examples

```bash
# Set a plugin's config
navidrome plugin edit my-plugin --config '{"apiKey":"abc123"}'

# Read the config from stdin
cat config.json | navidrome plugin edit my-plugin --config-file -

# Give access to all users and let the plugin write to libraries
navidrome plugin edit my-plugin --all-users --write-access

# Limit the plugin to two libraries
navidrome plugin edit my-plugin --libraries 1,2
```

### `plugin rescan`

Looks in the plugins folder again and picks up plugins you added or removed. It needs
`Plugins.Folder` set.

```bash
navidrome plugin rescan
```

#### Flags

This subcommand has no flags.

#### Examples

```bash
# Pick up a new .ndp file you copied into the plugins folder
navidrome plugin rescan
```
