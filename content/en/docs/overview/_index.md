---
title: "Navidrome Overview"
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
- **Multi-library** support with user-specific access controls to separate different music collections
- **Multi-platform**, runs on macOS, Linux and Windows. **Docker** images are also provided
- Ready to use, official, **Raspberry Pi** binaries and Docker images available
- Automatically **monitors your library** for changes, importing new files and reloading new metadata
- **Themeable**, modern and responsive **Web interface** based on [Material UI](https://material-ui.com) and [React-Admin](https://marmelab.com/react-admin/)
- **Compatible** with all Subsonic/Madsonic/Airsonic clients. See below for a list of tested clients
- **Transcoding** on the fly. Can be set per user/player. **Opus encoding is supported**
- Translated to **34 languages** ([and counting](/docs/developers/translations/))
- Full support for **playlists**, with option to auto-import `.m3u` files and to keep them in sync
- **Smart**/dynamic playlists (similar to iTunes). More info [here](https://github.com/navidrome/navidrome/issues/1417)
- Scrobbling to **Last.fm**, **ListenBrainz** and **Maloja** (via custom ListenBrainz URL)
- **Sharing** public links to albums/songs/playlists
- **Externalized authentication** to use your own authentication service instead of Navidrome's built-in one
- [Jukebox mode](/docs/usage/features/jukebox) allows playing music on an audio device attached to the server, and control from a client

### Features supported by the Subsonic API

- Tag-based browsing/searching
- Simulated browsing by folders (see note below)
- Playlists
- Bookmarks (for Audiobooks)
- Starred (favourites) Artists/Albums/Tracks
- 5-Star Rating for Artists/Albums/Tracks
- Transcoding and Downsampling
- Get/Save Play Queue (to continue listening in a different device)
- Last.fm and ListenBrainz scrobbling
- Artist Bio from [Last.fm](/docs/usage/integration/external-services/#lastfm)
- Artist Images from [Last.fm](/docs/usage/integration/external-services/#lastfm), [Spotify](/docs/usage/integration/external-services/#spotify) and [Deezer](/docs/usage/integration/external-services/#deezer)
- Album images and description from [Last.fm](/docs/usage/integration/external-services/#lastfm)
- Lyrics (from embedded tags and external files)
- Internet Radios
- [Jukebox mode](/docs/usage/features/jukebox)
- Shares ([experimental support](https://github.com/navidrome/navidrome/pull/2106))

{{< alert color="warning" title="NOTE" >}}
Navidrome [**does not support**](/docs/faq/#can-you-add-a-browsing-by-folder-optionmode-to-navidrome)
browsing by folders, but simulates it based on the tags with a structure like:
`/AlbumArtist/Album/01-Song.ext`
{{</alert>}}

## Apps

Navidrome features a modern, responsive Web UI built with Material UI and React. Beyond the built-in web interface, Navidrome is compatible with a wide ecosystem of Subsonic and OpenSubsonic clients across all major platforms, including mobile apps for iOS and Android, desktop applications for Windows, macOS, and Linux, as well as specialized clients for Android TV, CarPlay, and Android Auto.

Whether you prefer streaming on the go, listening to your library from your desktop, or casting to your home entertainment system, there's a client app tailored to your needs. Browse our comprehensive [client apps directory](/apps/) to find the perfect player for your setup!

<p align="center">
  <a href="/apps/">{{< imgproc app-catalog Resize "962x" webp />}}</a>
</p>

## Road map

This project is in active development. Expect a more polished experience and new features/releases
on a frequent basis. Some upcoming features planned:

- New UI, including a [Smart playlists editor](/docs/usage/features/smart-playlists)
- Plugins
