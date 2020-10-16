---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
description: >
  Frequently Asked Questions
---

### How can I edit my music metadata (id3 tags)? How can I rename/move my files?
With Navidrome you can't. Navidrome does not write to you music folder or the files by design. It may have capabilities to change/add 
cover art for artists, albums and playlists in the future, but even then it won't write these images to your Music Folder or 
embed them in the files.

The main reason for this is **security**: With an internet-facing software like Navidrome, users would only be one exploit 
away from all their music getting deleted.

There are many excellent "real" tag editors / music library managers out there to work with your music library, 
ex: [beets](https://beets.io), [Picard](https://picard.musicbrainz.org/) and [ExifTool](https://exiftool.org/)


### How can I manually trigger a re-scan in Navidrome
Currently rescanning must be done via the command line:
```bash
navidrome scan --datafolder="C:\path\to\datafolder" [-f]
```
The `datafolder` is where you can find the `navidrome.db` database. Use `-f` to scan all folders (not only the ones with detected changes)

When using `docker-compose` with the official Docker build, the `datafolder` options is already set, you can use the following command:
```bash
docker-compose exec navidrome /app/navidrome scan [-f]
```

An option to force scan via the UI is under development. More information can be found in [Issue #130](https://github.com/deluan/navidrome/issues/130#issuecomment-675684387).