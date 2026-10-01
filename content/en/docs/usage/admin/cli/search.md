---
title: "navidrome search"
linkTitle: "search"
date: 2026-09-13
weight: 90
description: >
  Rebuild the full-text search index
---

The `search` command maintains the full-text search index.

## Usage

```bash
navidrome search <subcommand> [flags]
```

All commands also accept the [global flags](/docs/usage/admin/cli/#global-flags).

## Subcommands

| Subcommand                  | Description                                                     |
| --------------------------- | --------------------------------------------------------------- |
| [`rebuild`](#search-rebuild) | Delete the search index and build it again from the library data |

### `search rebuild`

Deletes the full-text search index and builds it again from your library data. The index only holds
copies of data stored elsewhere in the database, so you lose nothing. Navidrome checks the new index
before it saves it.

```bash
navidrome search rebuild [-f]
```

Use it in two cases:

- [`navidrome doctor`](/docs/usage/admin/cli/doctor/) reports that the corruption is limited to the
  search index.
- Search misses items that are in your library. `doctor` can't detect an index that is out of sync
  but not corrupt, so a rebuild is the thing to try.

Without `--force`, the command asks you to type `YES` to continue.

#### Flags

| Flag          | Default | Description                  |
| ------------- | ------- | ---------------------------- |
| `-f, --force` | `false` | Skip the confirmation prompt |

#### Examples

```bash
# Check the database, then rebuild a corrupted search index
navidrome doctor
navidrome search rebuild

# With Docker Compose, stop the server first
docker compose stop navidrome
docker compose run --rm navidrome search rebuild
docker compose start navidrome
```

{{% alert color="warning" title="Important" %}}
Stop Navidrome before you run `navidrome search rebuild`.
{{% /alert %}}
