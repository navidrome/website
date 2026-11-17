---
title: "Navidrome v0.64.0: Jellyfin clients, playlist favourites and security fixes"
linkTitle: "v0.64.0"
date: 2026-09-12
description: "Security fixes, experimental Jellyfin client support, playlist favourites, refreshed artwork loading and faster browsing for your music library."
slug: navidrome-v0-64-0
author: Navidrome
release: "v0.64.0"
release_url: "https://github.com/navidrome/navidrome/releases/tag/v0.64.0"
# Publish only the files the page uses (the audio), not the narration, notes or audio.json.
build:
  publishResources: false
---

{{< release-audio >}}

**This release includes security fixes, and we recommend upgrading.** Navidrome v0.64.0 adds experimental support for Jellyfin music clients such as Finamp and Jellify, playlist favourites, and album and artist metadata refresh actions. Artwork now loads with blurred previews, while filtering and large-library playlist imports are faster.

## Security fixes

- **Library data:** A flaw in artist sorting and filtering could allow unintended database access. This affected servers accepting those requests. ([Security advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-hm54-32q6-3rcr))
- **Private libraries:** Share creation could expose another user's private library. Shares now always belong to the person creating them. ([Security advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-82gh-4ggp-gfg5))
- **Servers running plugins:** Plugin web connections could bypass restrictions on access to private network addresses. Those restrictions are now enforced. ([Fix](https://github.com/navidrome/navidrome/commit/1a8463f7d))
- **Servers using plugin WebSocket connections:** Missing network restrictions could let plugins reach private network addresses. These connections now receive the same protection. ([Security advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-pr2j-mfc8-qjcc))
- **Login protection:** Login attempt limits could be bypassed, weakening protection against repeated password guessing. ([#6124](https://github.com/navidrome/navidrome/pull/6124))
- **Server availability:** Malformed artwork requests could exhaust memory. Artwork dimensions are now checked before images are decoded. ([#5847](https://github.com/navidrome/navidrome/pull/5847))
- **Public shares:** A share could stream tracks that were not included in it. Streams are now restricted to the share's tracks. ([#5769](https://github.com/navidrome/navidrome/pull/5769))
- **Share access, login requests and logs:** Additional checks protect shared resources and limit oversized login requests. Log files now have restricted permissions, and Last.fm authentication tokens are no longer logged. ([#6098](https://github.com/navidrome/navidrome/pull/6098))
- **Servers running plugins:** Plugins could access files outside their assigned folders. Folder boundaries and plugin names are now checked. ([#5881](https://github.com/navidrome/navidrome/pull/5881), [#5886](https://github.com/navidrome/navidrome/pull/5886))
- **Credentials in logs:** Sensitive authentication information is now hidden in request logs. ([Fix](https://github.com/navidrome/navidrome/commit/82b9a44a1))

Some linked security advisories may not be publicly available yet. The fixes are included in this release.

## Before you upgrade

- **Back up your database before upgrading.** This release migrates item identifiers throughout the database. Clients that remember those identifiers, including clients with offline downloads, may need to re-sync afterward. ([#5824](https://github.com/navidrome/navidrome/pull/5824))
- **Check any installed plugins for compatibility.** Plugin network access rules have changed, and plugins using the old web-request method need updating. Plugins connecting to local network services also need explicit permission for those addresses. ([HTTP changes](https://github.com/navidrome/navidrome/commit/1a8463f7d), [WebSocket changes](https://github.com/navidrome/navidrome/commit/276d767ce))
- **Shares can no longer be created on another user's behalf.** If you used that workflow, have the intended owner create the share instead. ([Details](https://github.com/navidrome/navidrome/commit/1a8463f7d))
- **Negative configuration durations now prevent startup.** Check for and correct any negative duration values before upgrading. ([#6002](https://github.com/navidrome/navidrome/pull/6002))

## Listen with Jellyfin music clients

You can now connect Jellyfin-compatible music clients such as Finamp and Jellify to Navidrome. This support is experimental and disabled by default; enable it with `Jellyfin.Enabled = true`. ([#5730](https://github.com/navidrome/navidrome/pull/5730))

Supported features include browsing and search, favourites and ratings, playlists, lyrics, ReplayGain volume normalization, and filtering by year and record label. Instant Mix can start from an album, playlist or genre. ([#5791](https://github.com/navidrome/navidrome/pull/5791), [#5948](https://github.com/navidrome/navidrome/pull/5948), [#5815](https://github.com/navidrome/navidrome/pull/5815), [#5817](https://github.com/navidrome/navidrome/pull/5817), [#5809](https://github.com/navidrome/navidrome/pull/5809))

If you have a sonic similarity plugin installed, Jellyfin clients can also offer similar tracks and sonic paths. ([#5782](https://github.com/navidrome/navidrome/pull/5782))

## Keep favourite playlists close

Playlists now have a heart button, a favourites filter, and a sidebar toggle to show only favourites. Playlist favourites and ratings are stored separately for each user. ([#5805](https://github.com/navidrome/navidrome/pull/5805), [#5749](https://github.com/navidrome/navidrome/pull/5749))

Importing playlists is much faster on large libraries, and smart playlists can sort and filter using album-level fields. ([#6055](https://github.com/navidrome/navidrome/pull/6055), [#5899](https://github.com/navidrome/navidrome/pull/5899))

## Refresh artwork and metadata

Artwork now shows a blurred preview while the full image loads in the background. Missing artwork is checked again less frequently rather than on every request. ([#5847](https://github.com/navidrome/navidrome/pull/5847))

New **Refresh Metadata** actions on album and artist pages, and in their context menus, let you request an update directly. Deezer artist matching is also more reliable when multiple artists share a name. ([#6036](https://github.com/navidrome/navidrome/pull/6036), [#6078](https://github.com/navidrome/navidrome/pull/6078), [#5808](https://github.com/navidrome/navidrome/pull/5808))

## Make browsing your own

- **Natural sorting:** Put names such as “Track 2” before “Track 10” by setting `EnableNaturalSorting = true`. It is off by default. ([#6015](https://github.com/navidrome/navidrome/pull/6015))
- **Faster filtering:** Filtering your library by genre or artist is now much faster. ([#5940](https://github.com/navidrome/navidrome/pull/5940), [#5930](https://github.com/navidrome/navidrome/pull/5930))
- **More themes:** Choose Catppuccin Mocha or Frappé, or use the updated Macchiato theme with its official palette. ([#5835](https://github.com/navidrome/navidrome/pull/5835))
- **More starting pages:** Artists, Songs, Playlists and Radio are now available as Default View choices. Your items-per-page selection also stays with you across sessions. ([#5754](https://github.com/navidrome/navidrome/pull/5754), [#5801](https://github.com/navidrome/navidrome/pull/5801), [#5819](https://github.com/navidrome/navidrome/pull/5819))

## Notable fixes

- Returning to a page restores its scroll position, and closing the disc-cover viewer no longer starts playback. ([#5892](https://github.com/navidrome/navidrome/pull/5892), [#5901](https://github.com/navidrome/navidrome/pull/5901))
- Login no longer sometimes displays the wrong user. ([#5882](https://github.com/navidrome/navidrome/pull/5882), [#5767](https://github.com/navidrome/navidrome/pull/5767))
- Playlist file edits are detected more reliably, playlists reload after rating or loving a track, and removing many tracks at once no longer fails. ([#5914](https://github.com/navidrome/navidrome/pull/5914), [#6009](https://github.com/navidrome/navidrome/pull/6009), [#5977](https://github.com/navidrome/navidrome/pull/5977))
- Opening top menus no longer resizes the album grid in Safari. ([#6125](https://github.com/navidrome/navidrome/pull/6125))
- Audio already in the player's requested format avoids unnecessary re-encoding, and seeking now works with piped FLAC transcodes. AAC streams are also identified correctly for players. ([#6105](https://github.com/navidrome/navidrome/pull/6105), [#5998](https://github.com/navidrome/navidrome/pull/5998))
- Out-of-order playback reports are no longer rejected, improving scrobbling reliability. ([#5793](https://github.com/navidrome/navidrome/pull/5793))

## Credits

[@deluan](https://github.com/deluan) contributed Jellyfin client support, artwork loading, playlist favourites, metadata refresh actions, browsing improvements, security hardening and many fixes throughout this release.

Thanks to:

- [@kgarner7](https://github.com/kgarner7) for Jellyfin features and artwork fixes; [@cmyksoda](https://github.com/cmyksoda) for the Catppuccin themes.
- [@apkatsikas](https://github.com/apkatsikas) for the login display fix, [@junkerderprovinz](https://github.com/junkerderprovinz) for playlist scanning fixes, [@polybjorn](https://github.com/polybjorn) for playlist refresh fixes, [@york9675](https://github.com/york9675) for the Safari grid fix, and [@justadityaraj](https://github.com/justadityaraj) for correct AAC stream identification.
- [@fxj368](https://github.com/fxj368), [@McCio](https://github.com/McCio) and [@karigane-cha](https://github.com/karigane-cha) for Chinese (Simplified), Italian and Japanese translation updates, and everyone contributing translations through POEditor.
- [@Sudo-Ivan](https://github.com/Sudo-Ivan) for reporting and fixing the artist-filtering vulnerability; [@gigioneggiando](https://github.com/gigioneggiando), [@qrn12580](https://github.com/qrn12580), [@gehan-psbc](https://github.com/gehan-psbc), [@skarn958](https://github.com/skarn958) and [@arpitjain099](https://github.com/arpitjain099) for responsibly reporting security issues.

For technical details, such as API, plugin and command line changes, read the
[full release notes on GitHub](https://github.com/navidrome/navidrome/releases/tag/v0.64.0).
