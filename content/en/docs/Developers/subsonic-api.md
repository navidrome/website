---
title: "Subsonic API Compatibility"
linkTitle: "Subsonic API Compatibility"
weight: 30
description: >
  Are you a Subsonic client developer? Check out the API features supported by Navidrome
---

###  Supported Subsonic API endpoints

Navidrome is currently compatible with [Subsonic API](http://www.subsonic.org/pages/api.jsp) 
v1.10.2, with some exceptions.

This is an (almost) up to date list of all Subsonic API endpoints implemented by Navidrome. 
Check the "Notes" column for limitations/missing behavior. Also keep in mind these differences 
between Navidrome and Subsonic:
* Right now, Navidrome only works with a single Music Library (Music Folder)
* Navidrome does not mark songs as played by calls to `stream`, only when 
 `scrobble` is called with `submission=true`


| _System_               ||
|------------------------|-|
| `ping`                 | |
| `getLicense`           | Always valid ;) |    

| _Browsing_             ||
|------------------------|-|
| `getMusicFolders`      | Hardcoded to just one, set with ND_MUSICFOLDER configuration |
| `getIndexes`           | Doesn't support shortcuts, nor direct children |
| `getMusicDirectory`    | |
| `getSong`              | |
| `getArtists`           | |
| `getArtist`            | |
| `getAlbum`             | |
| `getGenres`            | |

| _Album/Songs Lists_    ||
|------------------------|-|
| `getAlbumList`         | |
| `getAlbumList2`        | |
| `getStarred`           | |
| `getStarred2`          | |
| `getNowPlaying`        | |
| `getRandomSongs`       | |
| `getSongsByGenre`      | |

| _Searching_            ||
|------------------------|-|
| `search2`              | Doesn't support Lucene queries, only simple auto complete queries |
| `search3`              | Doesn't support Lucene queries, only simple auto complete queries |

| _Playlists_            ||
|------------------------|-|
| `getPlaylists`         | `username` parameter is not implemented |
| `getPlaylist`          | |
| `createPlaylist`       | Return empty response on success |
| `updatePlaylist`       | |
| `deletePlaylist`       | |

| _Media Retrieval_      ||
|------------------------|-------|
| `stream`               | |
| `download`             | |
| `getCoverArt`          | Only gets embedded artwork |
| `getAvatar`            | Always returns the same image |

| _Media Annotation_     ||
|------------------------|-|
| `star`                 | |
| `unstar`               | |
| `setRating`            | |
| `scrobble`             | No Last.FM support yet. It is used to update play count and last played |

| _User Management_      ||
|------------------------|-|
| `getUser`              | Hardcoded all roles, ignores `username` parameter|
