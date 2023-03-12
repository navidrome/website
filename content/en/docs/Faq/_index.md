---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
description: >
  Frequently Asked Questions
---

## How can I edit my music metadata (id3 tags)? How can I rename/move my files?
With Navidrome you can't. Navidrome does not write to your music folder or the files by design. It may have capabilities to change/add 
cover art for artists, albums and playlists in the future, but even then it won't write these images to your Music Folder or 
embed them in the files.

The main reason for this is **security**: With an internet-facing server like Navidrome, users would only be one exploit 
away from all their music getting deleted.

There are many excellent "real" tag editors / music library managers out there to work with your music library. 

Navidrome recommends: [beets](https://beets.io) (Linux, macOS, Windows) and [Musicbrainz Picard](https://picard.musicbrainz.org/) (Linux, macOS, Windows).

Others: [mp3tag](https://www.mp3tag.de/en/index.html) (Windows, macOS), [ExifTool](https://exiftool.org/) (Linux, macOS, Windows), [Yate](https://2manyrobots.com/yate/) (macOS), [Kid3](https://kid3.kde.org/) (Windows, macOS, Linux), [foobar2000](https://www.foobar2000.org) (Windows, macOS), [MusicBee](https://getmusicbee.com/) (Windows), [Media Monkey](https://www.mediamonkey.com) (Windows), Groove Music (Windows), Windows Media Player (Windows), Apple iTunes (Windows), Apple Music (macOS).

If you are new to organizing and tagging your library, take a look at this post about how to use Picard or beets with Navidrome: [Organizing music with Musicbrainz Picard](http://www.thedreaming.org/2020/11/22/musicbrainz-picard/)

---
## I have an album with tracks by different artists, why is it broken up into lots of separate albums, each with their own artist?
Navidrome only organises music by tags, it will not automatically group a folder containing a bunch of songs with different artists into one album.

For a "Various Artists" compilation, the `Part Of Compilation` tag (`TCMP` for id3, `COMPILATION` for FLAC) must be set, for all tracks.

For a single-artist album with a different artist name for each track (for example "Alice feat. Bob" , "Alice feat. Carol"), the `Album Artist` tags must be the same ("Alice") for all tracks.


---
## Where are the logs?
To achieve maximum compatibility with a great number of platforms, Navidrome follows the [Twelve Factor App](https://12factor.net/) methodology 
as much as possible. Specifically in the case of [logs](https://12factor.net/logs), Navidrome does not try to do any storage or routing of 
any log files, it only outputs all information to `stdout`, making it easy for the proper logging tools in each platform to handle them. 
Some examples bellow:

- **Linux**: if you installed Navidrome using the Systemd unit (as explained in the [install instructions](/docs/installation/ubuntu-linux/#create-a-systemd-unit)), you can see the logs using the [journalctl](https://manpages.debian.org/stretch/systemd/journalctl.1.en.html) tool: `journalctl -u navidrome.service`.

- **Docker**: you can use `docker logs` or `docker-compose logs` to retrieve/follow the logs.

- **Windows**: depending on what you used to install Navidrome as a service, the logs will be in different locations by default:
	- if you used [Shawl](https://github.com/mtkennerly/shawl), just check the `shawl_for_navidrome_*.log` files created in the same location as the Shawl executable.
	- if you used [NSSM](http://nssm.cc/), the location of the logs are specified by the `AppStdout` attribute.
	- if you used [WinSW](https://github.com/winsw/winsw), the log file is in the same directory as the WinSW configuration file for the Navidrome service.

---
## Which cloud providers help fund the project with a revenue share?
[PikaPods](https://www.pikapods.com) has partnered with us to offer you an 
[officially supported, cloud-hosted solution](/docs/installation/managed/#pikapods). 
A share of the revenue helps fund the development of Navidrome at no additional cost for you.
