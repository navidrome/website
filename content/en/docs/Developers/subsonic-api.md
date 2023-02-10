---
title: "Subsonic API Compatibility"
linkTitle: "Subsonic API Compatibility"
weight: 30
description: >
  Are you a Subsonic client developer? Check out the API features supported by Navidrome
---

###  Supported Subsonic API endpoints

Navidrome is currently compatible with [Subsonic API](http://www.subsonic.org/pages/api.jsp) 
v1.16.1, with some exceptions.

This is a (hopefully) up-to-date list of all Subsonic API endpoints implemented in Navidrome. 
Check the "Notes" column for limitations/missing behavior. Also keep in mind these differences 
between Navidrome and Subsonic:
* Navidrome will not implement any video related functionality, it is focused on Music only
* Right now, Navidrome only works with a single Music Library (Music Folder)
* There are currently no plans to support browse-by-folder. Endpoints for this functionality (Ex: `getIndexes`, `getMusicDirectory`)
  returns a simulated directory tree, using the format: `/Artist/Album/01 - Song.mp3`.
* Navidrome does not mark songs as played by calls to `stream`, only when 
 `scrobble` is called with `submission=true`
* IDs in Navidrome are always strings, normally MD5 hashes or UUIDs. This is important to 
  mention because, even though the Subsonic API 
  [schema](http://www.subsonic.org/pages/inc/api/schema/subsonic-rest-api-1.16.1.xsd) 
  specifies IDs as strings, some clients insist in converting IDs to integers



| _System_     |                 |
|--------------|-----------------|
| `ping`       |                 |
| `getLicense` | Always valid ;) |    

| _Browsing_          |                                                                                |
|---------------------|--------------------------------------------------------------------------------|
| `getMusicFolders`   | Hardcoded to just one, set with ND_MUSICFOLDER configuration                   |
| `getIndexes`        | Doesn't support `shortcuts`, nor direct children                               |
| `getMusicDirectory` |                                                                                |
| `getSong`           |                                                                                |
| `getArtists`        |                                                                                |
| `getArtist`         |                                                                                |
| `getAlbum`          |                                                                                |
| `getGenres`         |                                                                                |
| `getArtistInfo`     | Requires [Last.fm and Spotify integration](/docs/usage/external-integrations/) |
| `getArtistInfo2`    | Requires [Last.fm and Spotify integration](/docs/usage/external-integrations/) |
| `getAlbumInfo`      | Requires [Last.fm and Spotify integration](/docs/usage/external-integrations/) |
| `getAlbumInfo2`     | Requires [Last.fm and Spotify integration](/docs/usage/external-integrations/) |
| `getTopSongs`       | Requires [Last.fm integration](/docs/usage/external-integrations/)             |
| `getSimilarSongs`   | Requires [Last.fm integration](/docs/usage/external-integrations/)             |
| `getSimilarSongs2`  | Requires [Last.fm integration](/docs/usage/external-integrations/)             |

| _Album/Songs Lists_ |     |
|---------------------|-----|
| `getAlbumList`      |     |
| `getAlbumList2`     |     |
| `getStarred`        |     |
| `getStarred2`       |     |
| `getNowPlaying`     |     |
| `getRandomSongs`    |     |
| `getSongsByGenre`   |     |

| _Searching_   |                                                                   |
|---------------|-------------------------------------------------------------------|
| `search2`     | Doesn't support Lucene queries, only simple auto complete queries |
| `search3`     | Doesn't support Lucene queries, only simple auto complete queries |

| _Playlists_              |                                         |
|--------------------------|-----------------------------------------|
| `getPlaylists`           | `username` parameter is not implemented |
| `getPlaylist`            |                                         |
| `createPlaylist`         |                                         |
| `updatePlaylist`         |                                         |
| `deletePlaylist`         |                                         |

| _Media Retrieval_      |                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `stream`               |                                                                                                                       |
| `download`             | Accepts ids for Songs, Albums, Artists and Playlists. Also accepts transcoding options similar to `stream`            |
| `getCoverArt`          |                                                                                                                       |
| `getLyrics`            | Currently only works with embedded lyrics                                                                             |
| `getAvatar`            | If Gravatar is enabled and the user has an email, returns a redirect to their Gravatar. Or else returns a placeholder |

| _Media Annotation_ |     |
|--------------------|-----|
| `star`             |     |
| `unstar`           |     |
| `setRating`        |     |
| `scrobble`         |     |

| _Bookmarks_            |                                                                                            |
|------------------------|--------------------------------------------------------------------------------------------|
| `getBookmarks`         |                                                                                            |
| `createBookmark`       |                                                                                            |
| `deleteBookmark`       |                                                                                            |
| `getPlayQueue`         | `current` is a string id, not `int` as it shows in the official Subsonic API documentation |
| `savePlayQueue`        |                                                                                            |

| _Sharing_ (if `EnableSharing` is `true`) |     |
|------------------------------------------|-----|
| `getShares`                              |     |
| `createShare`                            |     |
| `updateShare`                            |     |
| `deleteShare`                            |     |

| _Internet radio_             |     |
|------------------------------|-----|
| `getInternetRadioStations`   |     |
| `createInternetRadioStation` |     |
| `updateInternetRadioStation` |     |
| `deleteInternetRadioStation` |     |

| _User Management_        |                                                                                                          |
|--------------------------|----------------------------------------------------------------------------------------------------------|
| `getUser`                | Hardcoded all roles. Ignores `username` parameter, and returns the user identified in the authentication |
| `getUsers`               | Returns only the user identified in the authentication                                                   |

| _Media library scanning_ |                                                                 |
|--------------------------|-----------------------------------------------------------------|
| `getScanStatus`          | Also returns the extra fields `lastScan` and `folderCount`      |
| `startScan`              | Accepts an extra `fullScan` boolean param, to force a full scan |

