---
title: Missing Files
linkTitle: Missing Files
date: 2017-01-02
weight: 45
description: >
  Learn how to troubleshoot and resolve missing files in Navidrome, 
  including common causes and solutions for missing tracks and albums.
---

## Overview

When using Navidrome, you may encounter missing tracks or albums in your library. When moving or renaming files, 
Navidrome may not be able to match the old versions of your files with the new ones when scanning your library. 
This can result in "ghost" (grayed out) tracks or albums in your library. 

Only admins can see the missing tracks and albums in the library:

{{< imgproc missing_files Fit "2000x2000" />}}

Missing files are not removed from the database on new scans to avoid inadvertently losing information like ratings, 
and play counts and references in playlists.

You can still get the missing tracks information, including path and when it went missing by clicking in the `?` icon:

{{< imgproc get_info_icon Fit "2000x2000" />}}

{{< imgproc get_info_modal Fit "2000x2000" />}}

Note that this information is only available for admins.

## Common Causes

The main reason this can happen is that the file paths in your music library have changed, and Navidrome was not able
to match the new paths with the old ones. This can happen when you move or rename files AND change tags in the same
operation.

To learn how Navidrome matches missing files and newly discovered ones, see the documentation on
[PIDs](/docs/usage/pids/#handling-file-moves-and-retagging)
To avoid getting into this situation, it is recommended to move or rename files first, trigger a quick scan,
and then update the tags.

Another common case is when you have a network drive that is not always available, or a removable drive that is not
connected:

{{< imgproc all_missing Fit "2000x2000" />}}

In these cases, Navidrome will mark the files as missing until the drive is available again.

## Automatically Purging Missing Files

Navidrome lets you control when missing files are automatically removed from the database using the `Scanner.PurgeMissing` option. This option accepts three possible values:

- `"never"` (default): Just mark files, albums, and artists as missing (they remain in the database, preserving ratings, play counts, and playlist references).
- `"always"`: Purge any missing files, albums, and artists from the database after every scan.
- `"full"`: Purge missing files, albums, and artists only after a full scan (not after quick/incremental scans).

To set this option, add to your config file:

```toml
Scanner.PurgeMissing = "always"
```

Or set the environment variable:

```sh
ND_SCANNER_PURGEMISSING=always
```

{{< alert >}}
**Warning:** Purging missing files will permanently delete them from the database, including any associated ratings, play counts, and playlist entries.
{{< /alert >}}

## How to permanently delete Missing Files

If you are sure that the missing files are not coming back, you can permanently delete them from the database.
Log in as an admin, click on the `Settings` meu, and click on the `Missing Files` option. 

{{< imgproc missing_files_menu Fit "2000x2000" />}}

You will see a list of all missing files, with path, size and time they went missing. You will see options to export 
the list to a CSV file, or delete them from the database:

{{< imgproc missing_files_view Fit "2000x2000" />}}

To delete permanently the files from the database, select the ones you want to remove and click on the `Remove` button.

