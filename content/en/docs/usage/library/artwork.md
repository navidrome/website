---
title: "Artwork location resolution"
linkTitle: "Artwork resolution"
date: 2017-01-05
weight: 20
description: >
  How Navidrome finds, resolves, and manages artwork for artists, albums, discs, and playlists
aliases:
  - /docs/usage/artwork/
---

## Artists

Fetching images for artists is controlled by the `ArtistArtPriority` [config option][advanced-configuration].
This is a comma-separated list of places to look for artist images.
The default is `artist.*, album/artist.*, external`, meaning:

- First try to find an `artist.*` image in the artist folder(s)
- If not found, try to find an `artist.*` image in one of the album folders for this artist
- If not found, try to fetch it from an [external service](/docs/usage/integration/external-services)
- If not found, use the artist image placeholder (grey star image)

You can also configure a centralized folder for artist images using the `ArtistImageFolder` [config option][advanced-configuration] and adding `image-folder` to `ArtistArtPriority`. When configured, Navidrome will look for image files in that folder named after the artist's MusicBrainz ID or name.

## Albums

CoverArt fetching for albums is controlled by the `CoverArtPriority` [config option][advanced-configuration].
This is a comma-separated list of places to look for album art images.
The default is `cover.*, folder.*, front.*, embedded, external`, meaning:

- First try to find a `cover.*`, `folder.*` or `front.*` image in the album folder(s)
- If not found, try to read an embedded image from one of the mediafiles for that album
- If not found, try to fetch it from an [external service](/docs/usage/integration/external-services) (currently only Deezer and Last.fm)
- If not found, use the cover placeholder (blue record image)

## Disc Cover Art

Multi-disc albums can have disc-specific artwork. Navidrome uses the `DiscArtPriority` [config option][advanced-configuration] to find disc-level images.
The default is `disc*.*, cd*.*, cover.*, folder.*, front.*, discsubtitle, embedded`, meaning:

- First try to find a `disc*.*` or `cd*.*` image in the disc's folder
- Then try `cover.*`, `folder.*`, or `front.*` in the disc's folder
- The special keyword `discsubtitle` matches image files whose filenames equal the disc's subtitle
- Try to read an embedded image from one of the mediafiles for that disc
- If no disc-specific image is found, fall back to the album-level artwork

Example directory layout for a multi-disc album:

```text
Music/
└── Artist - Album/
    ├── disc1/
    │   ├── disc1.jpg        ← matched by disc*.*
    │   ├── 01 - Track.flac
    │   └── 02 - Track.flac
    ├── disc2/
    │   ├── cd2.png          ← matched by cd*.*
    │   ├── 01 - Track.flac
    │   └── 02 - Track.flac
    └── cover.jpg            ← album-level fallback
```

## MediaFiles

Some players (including Navidrome's own WebUI) can display different cover art images for each track in an album.
Navidrome resolves mediafile artwork in the following order:

1. Try to read an embedded image from the mediafile itself
2. For multi-disc albums, fall back to the disc-level artwork (see [Disc Cover Art](#disc-cover-art) above)
3. Fall back to the album cover art

MediaFile cover art can be slow in some systems and can be disabled by
setting `EnableMediaFileCoverArt=false`.

## Playlists

Playlist artwork is resolved in the following order:

1. **Uploaded image** — A custom image uploaded via the web UI (see [Artwork Uploads](#artwork-uploads) below)
2. **Sidecar image** — An image file with the same base name as the playlist file, placed alongside it
3. **M3U directive** — An image URL specified via the `#EXTALBUMARTURL` directive inside the M3U file. To allow HTTP/HTTPS URLs, set `EnableM3UExternalAlbumArt` to `true` in your [configuration][advanced-configuration]. Local file paths are always accepted.
4. **Tiled image** — An auto-generated mosaic of up to 4 album covers from the playlist
5. If none of the above are available, the album cover placeholder is used

Example of a playlist with a sidecar image:

```text
Playlists/
├── My Playlist.m3u
└── My Playlist.jpg          ← sidecar image
```

## Artwork Uploads

Navidrome allows uploading custom images for playlists, artists, and internet radio directly from the web UI. This is controlled by the `EnableArtworkUpload` [config option][advanced-configuration] (enabled by default). When disabled, only admin users can upload artwork.

**Supported formats:** GIF, JPEG, PNG, WebP
**Maximum file size:** 10 MB
**Storage location:** Uploaded images are stored in `<DataFolder>/artwork/`, organized by entity type (`artist/`, `playlist/`, `radio/`)

### Playlist Cover Art

To upload a custom playlist cover, open the playlist in the Navidrome web UI and hover the mouse over the current artwork. You should see a camera icon where you can click to select the image to upload. Uploaded images take priority over all other playlist artwork sources.

### Artist Images

Custom artist images can be uploaded via the web UI on the artist detail page. Follow the same process as the playlist cover art. 

### Internet Radio Images

You can also upload a custom image on the internet radio's edit page. This image will be used as the station's artwork instead of fetching its favicon (when available).

## Image Format & Quality

Navidrome serves resized artwork as WebP for better compression and performance. The `CoverArtQuality` [config option][advanced-configuration] controls the encoding quality for WebP output (default: `75`).

Animated GIFs embedded in or associated with your music files are preserved during resize — they are converted to animated WebP using ffmpeg.

[advanced-configuration]: /docs/usage/configuration/options/#advanced-configuration
