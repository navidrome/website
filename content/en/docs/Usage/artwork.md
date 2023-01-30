---
title: "Artwork resolution"
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

Image for artists are fetched following these rules:
1. Try to read an `artist.*` image file from the artist folder (the parent folder of all albums of a given artist). Ex:
  - `C:\Music\U2\Rattle And Run\CD1\01.mp3`
  - `C:\Music\U2\Boy\01.mp3`
    It will try to read the image from `C:\Music\U2\artist.*`
2. If not found, try to read an `artist.*` image from any album for that artist. If more than one is found, the
   selected one is unpredictable.
3. If not found, it will try to get it from an external source. Currently, this can only be Spotify, if configured.
4. If not found, use the artist image placeholder (grey star image).

## Playlists

Currently, Playlists CoverArt images are generated tiled images, containing up to 4 covers from the albums in the playlist.
If for any reason it cannot be generated, it will use the album cover placeholder (blue record image). This is currently only available in the Subsonic API.
