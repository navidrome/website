---
title: "navidrome user"
linkTitle: "user"
date: 2026-09-13
weight: 110
description: >
  Create, edit, list, and delete users
---

The `user` commands create, edit, list, and delete Navidrome users.

These commands need at least one admin user in the database. On a new install, create the first
admin in the web UI.

## Usage

```bash
navidrome user <subcommand> [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Subcommands

| Subcommand               | Alias | Description             |
| ------------------------ | ----- | ----------------------- |
| [`create`](#user-create) | `c`   | Create a user           |
| [`edit`](#user-edit)     | `e`   | Change a user           |
| [`list`](#user-list)     |       | List users              |
| [`delete`](#user-delete) | `d`   | Delete a user           |

### `user create`

Creates a user. The command asks for the password twice. Press Enter with no password to cancel.
There is no flag for the password, so run the command in a terminal. With `docker run`, add `-it`.

```bash
navidrome user create --username <username> [flags]
```

Without `--library-ids`, the user can access all libraries. Admins can always access all libraries,
so the command ignores `--library-ids` when you pass `--admin`. If a library ID doesn't exist, the
command fails and creates nothing.

#### Flags

| Flag                | Default       | Description                                              |
| ------------------- | ------------- | -------------------------------------------------------- |
| `-u, --username`    |               | Username to log in with. Required                        |
| `--name`            | The username  | Display name of the user                                 |
| `-e, --email`       |               | Email address of the user                                |
| `-a, --admin`       | `false`       | Make the user an admin                                   |
| `-i, --library-ids` | All libraries | Comma-separated IDs of the libraries the user can access |

#### Examples

```bash
# Create an admin user
navidrome user create --username alice --email alice@example.com --admin

# Create a regular user who can access libraries 1 and 3 only
navidrome user create --username bob --name "Bob Smith" --library-ids 1,3
```

### `user edit`

Changes a user. Find the user by username or ID, then pass the flags for what you want to change.
If nothing changes, the command says so.

```bash
navidrome user edit --user <username-or-id> [flags]
```

Some flags come in pairs, and you can't use both flags of a pair in one call. The pairs are
`--set-admin` and `--set-regular`, `--email` and `--remove-email`, and `--name` and
`--remove-name`.

`--set-admin` gives the user access to all libraries. `--set-regular` keeps the libraries the user
has, so add `--library-ids` to limit them.

#### Flags

| Flag                | Default | Description                                                          |
| ------------------- | ------- | -------------------------------------------------------------------- |
| `-u, --user`        |         | Username or ID of the user to change. Required                       |
| `--set-admin`       | `false` | Make the user an admin                                               |
| `--set-regular`     | `false` | Make the user a regular user                                         |
| `--set-password`    | `false` | Ask for a new password                                               |
| `-e, --email`       |         | New email address                                                    |
| `--remove-email`    | `false` | Clear the email address                                              |
| `--name`            |         | New display name                                                     |
| `--remove-name`     | `false` | Clear the display name                                               |
| `-i, --library-ids` |         | Comma-separated IDs of the libraries the user can access. Replaces the current list. Ignored with `--set-admin` |

#### Examples

```bash
# Make an admin a regular user
navidrome user edit --user alice --set-regular

# Change a password. The command asks for the new one
navidrome user edit --user alice --set-password

# Limit a user to libraries 1 and 2
navidrome user edit --user bob --library-ids 1,2
```

### `user list`

Lists all users. The CSV output has these columns: user id, username, user's name, user email,
admin, created at, updated at, last access, last login, and libraries. The libraries column lists
each library as `id:path`, separated by `|`.

```bash
navidrome user list [-f csv|json]
```

#### Flags

| Flag           | Default | Description                         |
| -------------- | ------- | ----------------------------------- |
| `-f, --format` | `csv`   | Output format. One of `csv`, `json` |

#### Examples

```bash
# List users as CSV
navidrome user list

# List users as JSON
navidrome user list --format json
```

### `user delete`

Deletes a user. The command doesn't ask for confirmation. It won't delete the last user.

```bash
navidrome user delete --user <username-or-id>
```

#### Flags

| Flag         | Default | Description                                    |
| ------------ | ------- | ---------------------------------------------- |
| `-u, --user` |         | Username or ID of the user to delete. Required |

#### Examples

```bash
navidrome user delete --user alice
```
