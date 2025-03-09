---
title: Customizing Persistent IDs in Navidrome
linkTitle: Persistent IDs (PID)
date: 2017-01-02
weight: 45
description: >
    Learn how to configure and customize Persistent IDs (PIDs) in Navidrome to customize disambiguation
    and improve media management.
---

## Persistent IDs in Navidrome

Persistent IDs (PIDs) are configurable identifiers introduced to provide stable references for Tracks and Albums in Navidrome, significantly improving how media is managed and identified.

### Overview of Persistent IDs

Persistent IDs are unique, user-configurable identifiers for tracks and albums, enabling Navidrome to accurately detect and manage moved or re-tagged files, and disambiguate albums with identical names or duplicated entries.

### Key Features
- **Configurable and Flexible:** Users can define their PID structure using various tags, including 
  `musicbrainz_trackid`, `albumid`, `discnumber`, `tracknumber`, `title`, `folder`, `albumartistid`, Discogs IDs, or 
  even Catalog Numbers.
- **Accurate File Detection:** Navidrome recognizes moved or re-tagged files, preventing duplication or mismatches.
- **Album Disambiguation:** Easily differentiate albums with identical names through custom tags like `version` (e.g., Deluxe Editions).

### Default Configuration
The default [configuration][config] prioritizes MusicBrainz IDs (MBIDs) when available:

```toml
PID.Album = "musicbrainz_albumid|albumartistid,album,albumversion,releasedate"
PID.Track = "musicbrainz_trackid|albumid,discnumber,tracknumber,title"
```

- **Track PID:**
    - Uses `musicbrainz_trackid` if available.
    - Otherwise, combines `albumid`, `discnumber`, `tracknumber`, and `title`. (`albumid` is derived from `PID.Album`.)

- **Album PID:**
    - Uses `musicbrainz_albumid` if available.
    - Otherwise, combines `albumartistid`, `album`, `albumversion`, and `releasedate`.

### Customizing PIDs
You can create custom PID configurations to meet specific needs, such as:
- Grouping albums by folder:
  ```toml
  PID.Album = "folder"
  ```
- Using Discogs or custom IDs for albums:
  ```toml
  Tags.discogs_release_id.Aliases = ['DISCOGS_RELEASE_ID']
  PID.Album = 'discogs_release_id|albumartistid,album,albumversion,releasedate'
  ```
  
- Using the pre-0.55.0 (pre-BFR) behaviour:
  ```toml
  PID.Album = "album_legacy"
  PID.Track = "track_legacy"
  ```
  This will use the old ID generation method, which is based on the file path for tracks and name+releaseDate for albums.

{{< alert color="warning" title="Important considerations" >}}
- **Full Rescan Required:** Changing PID configurations triggers a full rescan. Navidrome will reassign PIDs accordingly, preserving playlists, stars, ratings, shares, and playcounts.
- **Backup Your Database:** Before changing PID configurations, back up your Navidrome database to prevent data loss.
{{< /alert >}}

### Handling File Moves and Retagging

When files are moved, Navidrome uses PIDs to accurately identify and reconnect these files on the next scan:

- First, Navidrome attempts to match missing files with new ones based on exact tags.
- If exact tags do not match, Navidrome checks for a matching PIDs.
- Finally, if no PID match is found, it attempts to match the file based on the original file path, excluding the 
  file extension (ex: `/artist/album/01-track.mp3` → `/artist/album/01-track.flac`).

This ensures minimal disruption to playlists, ratings, and play counts when managing your media library.

You can also retag your files, and Navidrome will automatically update the PIDs based on the new tags. 

{{< alert color="warning" title="Important" >}}
Retagging and moving files **cannot** be done in the same scan, because Navidrome will not match new files with the old 
ones. First, retag the files and perform a scan, then move them and scan again, or move first, scan, and then retag.
{{< /alert >}}


### Artist IDs
Currently, Artist PIDs rely solely on the artist `name` due to limitations in TagLib/Picard regarding MBIDs for 
composer and other roles, potentially causing duplicate entries. For this reason they are not configurable. 
Future enhancements are planned to address this.


### Troubleshooting and Support
If issues arise when enabling or configuring PIDs:
- Review Navidrome [logs][logs].
- Validate your [configuration file][config].


[logs]: /docs/faq/#-where-are-the-logs
[config]: /docs/usage/configuration-options