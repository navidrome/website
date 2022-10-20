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
## I deleted a song from my music folder however the album is still listed in the UI?
This is a known bug, and [a rather uncommon situation for self-hosted users](https://github.com/navidrome/navidrome/issues/868#issuecomment-803699959) that have their music in the **root** music folder. (see [Configuration Options](https://www.navidrome.org/docs/usage/configuration-options/).)

The workaround involves placing your music collection within a subfolder, instead of in the **root** music directory. (see this [Github issue](https://github.com/navidrome/navidrome/issues/937#issuecomment-1257089106))

eg. /music/music/<your music here>, instead of /music/<your music here>


Prevention is better than a cure, however if you are experiencing this bug:
1. Stop the Navidrome service.
	__For more information:__ see [Installation](https://www.navidrome.org/docs/installation/) and select your setup type.
2. Navigate to the **config** directory, and remove all of its contents. 
	__NOTE:__ this will effectively reset all of your settings, so a 'fresh' setup will be required. Doing this **does not** delete your music
3. If you haven't placed your music within a subdirectory yet, do so now.
4. Restart the Navidrome service, recommence the setup
