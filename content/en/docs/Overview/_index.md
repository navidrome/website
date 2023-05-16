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
- **Multi-platform**, runs on macOS, Linux and Windows. **Docker** images are also provided
- Ready to use, official, **Raspberry Pi** binaries and Docker images available
- Automatically **monitors your library** for changes, importing new files and reloading new metadata 
- **Themeable**, modern and responsive **Web interface** based on [Material UI](https://material-ui.com) and [React-Admin](https://marmelab.com/react-admin/)
- **Compatible** with all Subsonic/Madsonic/Airsonic clients. See below for a list of tested clients
- **Transcoding** on the fly. Can be set per user/player. **Opus encoding is supported**
- Translated to **17 languages** ([and counting](/docs/developers/translations/))
- Full support for **playlists**, with option to auto-import `.m3u` files and to keep them in sync
- **Smart**/dynamic playlists (similar to iTunes). More info [here](https://github.com/navidrome/navidrome/issues/1417)
- Scrobbling to **Last.fm**, **ListenBrainz** and **Maloja** (via custom ListenBrainz URL)
- **Sharing** public links to albums/songs/playlists
- **Reverse Proxy** authentication[\*](/docs/usage/security/#reverse-proxy-authentication)

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
- Artist Bio from Last.fm
- Artist Images from [Spotify (requires configuration)](/docs/usage/external-integrations/#spotify)
- Album images and description from Last.fm
- Lyrics (currently only from embedded tags)
- Internet Radios
- Shares ([experimental support](https://github.com/navidrome/navidrome/pull/2106))

{{< alert color="warning" title="NOTE" >}}
Navidrome [**does not support**](/docs/faq/#can-you-add-a-browsing-by-folder-optionmode-to-navidrome) 
browsing by folders, but simulates it based on the tags with a structure like: 
`/AlbumArtist/Album/01-Song.ext`
{{</alert>}}
## Apps

Besides its own Web UI, Navidrome should be compatible with all Subsonic clients. The following clients are tested and confirmed to work properly:
- iOS: [play:Sub](http://michaelsapps.dk/playsubapp/), 
[substreamer](https://substreamerapp.com/),
[Amperfy](https://github.com/BLeeEZ/amperfy#readme) and 
[iSub](https://isub.app/)
- Android: [DSub](https://play.google.com/store/apps/details?id=github.daneren2005.dsub),
[Subtracks](https://github.com/austinried/subtracks#readme),
[substreamer](https://substreamerapp.com/),
[Symfonium](https://symfonium.app/) and
[Ultrasonic](https://ultrasonic.gitlab.io/)
- Web: 
[Feishin](https://feishin.vercel.app/),
[Thunderdrome](https://thunderdrome.netlify.app/),
[Airsonic Refix](https://airsonic.netlify.com/), 
[Subplayer](https://subplayer.netlify.app/),
[Aurial](http://shrimpza.github.io/aurial/),
[Jamstash](http://jamstash.com) and
[Subfire](http://p.subfireplayer.net/)
- Desktop: [Sonixd](https://github.com/jeffvli/sonixd) (Windows/Linux/macOS), 
[Feishin](https://github.com/jeffvli/feishin) (Linux/macOS),
[Sublime Music](https://sublimemusic.app/) (Linux),
[Supersonic](https://github.com/dweymouth/supersonic) (Windows/Linux/macOS) and 
[Submariner](https://submarinerapp.com/) (macOS)
- CLI: [Jellycli](https://github.com/tryffel/jellycli#readme) (Windows/Linux) and [STMP](https://github.com/wildeyedskies/stmp#readme) (Linux/macOS)
- Connected Speakers:
  - Sonos: [bonob](https://github.com/simojenki/bonob#readme)
  - Alexa: [AskSonic](https://github.com/srichter/asksonic#readme)
- Other: 
  - [Subsonic Kodi Plugin](https://github.com/warwickh/plugin.audio.subsonic#readme)
  - [Navidrome Kodi Plugin](https://github.com/BobHasNoSoul/plugin.audio.navidrome#readme)
  - [HTTPDirFS](https://github.com/fangfufu/httpdirfs#readme)
  - [upmpdcli](https://www.lesbonscomptes.com/upmpdcli/index.html): expose Navidrome as a UPnP/DLNA media library. See the [discussion](https://github.com/navidrome/navidrome/discussions/2324).
    
For more options, look at the [list of clients](https://airsonic.github.io/docs/apps/) maintained by 
the Airsonic project.

## Road map

This project is in active development. Expect a more polished experience and new features/releases 
on a frequent basis. Some upcoming features planned: 

- [Multiple Artists](https://github.com/navidrome/navidrome/issues/211)
- [Multiple folders](https://github.com/navidrome/navidrome/issues/192)
- [UI to edit Smart playlists](https://github.com/navidrome/navidrome/issues/1417)
- [Jukebox mode](https://github.com/navidrome/navidrome/issues/364) (plays music on an audio device attached to the server, and control from the UI/Mobile client)
- [Support more tags](https://github.com/navidrome/navidrome/issues/1036) (including multi-valued tags)

