---
title: "Overview"
linkTitle: "Overview"
weight: 1
description: >
  Learn more about Navidrome's features
---

Navidrome can be used as a standalone server, that allows you to browse and listen to your music collection using a web browser. 


It can also work as a lightweight Subsonic-API compatible server, that can be used with any 
[Subsonic compatible client](/docs/overview/#apps).

## Features

- Very **low resource usage**. Runs well even on simple Raspberry Pi Zero and old hardware setups
- Handles very **large music collections**
- Streams virtually **any audio format** available
- Reads and uses all your beautifully curated **metadata**
- Great support for **compilations** (Various Artists albums) and **box sets** (multi-disc albums)
- **Multi-user**, each user has their own play counts, playlists, favorites, etc..
- **Multi-platform**, runs on macOS, Linux and Windows. **Docker** images are also provided
- Ready to use, official, **Raspberry Pi** binaries and Docker images available
- Automatically **monitors your library** for changes, importing new files and reloading new metadata 
- **Themeable**, modern and responsive **Web interface** based on [Material UI](https://material-ui.com)
- **Compatible** with all Subsonic/Madsonic/Airsonic clients. See below for a list of tested clients
- **Transcoding** on the fly. Can be set per user/player. **Opus encoding is supported**
- Translated to **10 languages** ([and counting](/docs/developers/translations/))
- Full support for **playlists**, with option to auto-import `.m3u` files and to keep them in sync

### Features supported by the Subsonic API

- Tag-based browsing/searching
- Playlists
- Bookmarks (for Audiobooks)
- Starred Artists/Albums/Tracks
- 5-Star Rating
- Transcoding
- Get/Save Play Queue (to continue listening in a different device)

## Apps

Besides its own Web UI, Navidrome should be compatible with all Subsonic clients. The following clients are tested and confirmed to work properly:
- iOS: [play:Sub](http://michaelsapps.dk/playsubapp/)
- Android: [DSub](https://play.google.com/store/apps/details?id=github.daneren2005.dsub),
[Ultrasonic](https://play.google.com/store/apps/details?id=org.moire.ultrasonic),
[Audinaut](https://github.com/nvllsvm/Audinaut) and
[Music Stash](https://play.google.com/store/apps/details?id=com.ghenry22.mymusicstash)
- Web: [Aurial](http://shrimpza.github.io/aurial/),
[Subplayer](https://github.com/peguerosdc/subplayer), [Airsonic Frontend](https://github.com/tamland/airsonic-frontend), 
[Jamstash](http://jamstash.com) and
[Subfire](http://p.subfireplayer.net/)
- Desktop: [Sublime Music](https://sublimemusic.app/) (Linux/macOS)
    
For more options, look at the [list of clients](https://airsonic.github.io/docs/apps/) maintained by 
the Airsonic project. Please open an [issue](https://github.com/deluan/navidrome/issues) if you have any 
trouble with the client of your choice.

## Road map

This project is in active development. Expect a more polished experience and new features/releases 
on a frequent basis. Some upcoming features planned: 

- Last.FM integration (for scrobbling and getting artist/album info)
- Smart/dynamic playlists (similar to iTunes)
- Jukebox mode
- Sharing links to albums/songs/playlists

