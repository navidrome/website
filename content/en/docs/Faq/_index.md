---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
description: >
  Frequently Asked Questions
---

## How can I edit my music metadata (id3 tags)? How can I rename/move my files?
With Navidrome you can't. Navidrome does not write to you music folder or the files by design. It may have capabilities to change/add 
cover art for artists, albums and playlists in the future, but even then it won't write these images to your Music Folder or 
embed them in the files.

The main reason for this is **security**: With an internet-facing software like Navidrome, users would only be one exploit 
away from all their music getting deleted.

There are many excellent "real" tag editors / music library managers out there to work with your music library, 
ex: [beets](https://beets.io), [Picard](https://picard.musicbrainz.org/) and [ExifTool](https://exiftool.org/).


## How can I manually trigger a re-scan in Navidrome
Currently rescanning must be done via the command line:
```bash
navidrome scan --datafolder="C:\path\to\datafolder" [-f]
```
The `datafolder` is where you can find the `navidrome.db` database. Use `-f` to scan all folders (not only the ones with detected changes).

When using `docker-compose` with the official Docker build, the `datafolder` options is already set, you can use the following command:
```bash
docker-compose exec navidrome /app/navidrome scan [-f]
```

An option to force scan via the UI is under development. More information can be found in [Issue #130](https://github.com/deluan/navidrome/issues/130#issuecomment-675684387).


## Where are the logs?
To achieve maximum compatibility with a great number of platforms, Navidrome follows the [Twelve Factor App](https://12factor.net/) methodology 
as much as possible. Specifically in the case of [logs](https://12factor.net/logs), Navidrome does not try to do any storage or routing of 
any log files, it only outputs all information to `stdout`, making it easy for the proper logging tools in each platform to handle them. 
Some examples bellow:

- **Linux**: if you installed Navidrome using the Systemd unit (as explained in the [install instructions](/docs/installation/pre-built-binaries/#create-a-systemd-unit)), you can see the logs using the [journalctl](https://manpages.debian.org/stretch/systemd/journalctl.1.en.html) tool: `journalctl -f -u navidrome.service`.

- **Docker**: you can use `docker logs` or `docker-compose logs` to retrieve/follow the logs.

- **Windows**: depending on what you used to install Navidrome as a service, the logs will be in different locations by default:
	- if you used [Shawl](https://github.com/mtkennerly/shawl), just check the `shawl_for_navidrome_*.log` files created in the same location as the Shawl executable.
	- if you used [NSSM](http://nssm.cc/), the location of the logs are specified by the `AppStdout` attribute.
	- if you used [WinSW](https://github.com/winsw/winsw), the log file is in the same directory as the WinSW configuration file for the Navidrome service.