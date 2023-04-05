---
title: "Artwork location resolution"
linkTitle: "Artwork resolution"
date: 2017-01-05
description: >
  How Navidrome find artist and cover art images
---

## Albums

CoverArt fetching for albums is controlled by the `CoverArtPriority` [config option](/docs/usage/configuration-options). 
This is a comma-separated list of places to look for album art images. 
The default is `cover.*, folder.*, front.*, embedded, external`, meaning:
- First try to find a `cover.*`, `folder.*` or `front.*` image in the album folder(s)
- If not found, try to read an embedded image from one of the mediafiles for that album
- If not found, try to fetch it from an [external service](/docs/usage/external-integrations) (currently only Last.fm)
- If not found, use the cover placeholder (blue record image)

## MediaFiles

Some players (including Navidrome's own WebUI), can display different cover art images for each track in an album.
Navidrome tries to read an embedded image from the mediafile. If it does not have one, it will get the album cover
art as explained above. MediaFile cover art can be slow in some systems and can be disabled by
setting `EnableMediaFileCoverArt=false`.

## Artists

Fetching of images for artists is controlled by the `ArtistArtPriority` [config option](/docs/usage/configuration-options).
This is a comma-separated list of places to look for artist images.
The default is `artist.*, album/artist.*, external`, meaning:
- First try to find an `artist.*` image in the artist folder(s)
- If not found, try to find an `artist.*` image in one of the album folders for this artist
- If not found, try to fetch it from an [external service](/docs/usage/external-integrations) (currently only Spotify)
- If not found, use the artist image placeholder (grey start image)

## Playlists

Currently, Playlists CoverArt images are generated tiled images, containing up to 4 covers from the albums in the playlist.
If for any reason it cannot be generated, it will use the album cover placeholder (blue record image). This is currently only available in the Subsonic API.
