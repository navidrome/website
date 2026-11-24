---
title: "Navidrome v0.64.0: Jellyfin clients, playlist favourites and security fixes"
linkTitle: "v0.64.0"
date: 2026-09-12
description: "Security fixes, experimental support for Jellyfin music clients, playlist favourites, refreshed artwork loading and more control over your library."
slug: navidrome-v0-64-0
author: Navidrome
release: "v0.64.0"
release_url: "https://github.com/navidrome/navidrome/releases/tag/v0.64.0"
# Publish only the files the page uses (the audio), not the narration, notes or audio.json.
build:
  publishResources: false
---

{{< release-audio >}}

**This release includes security fixes, and we recommend upgrading.** Navidrome v0.64.0 also lets you try Jellyfin-compatible music clients, keep favourite playlists close at hand, refresh album and artist metadata, and browse with optional natural sorting.

## Security fixes

- **Library data:** A flaw in artist sorting and filtering could allow database queries to be manipulated on affected servers. This is now fixed. ([Advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-hm54-32q6-3rcr))
- **Private libraries:** Share creation could expose another user's private library by assigning a share to that user. Shares now always belong to their creator. ([Advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-82gh-4ggp-gfg5))
- **Servers using plugins:** Plugin HTTP connections could bypass restrictions on reaching private network services. Those restrictions are now enforced. ([Fix](https://github.com/navidrome/navidrome/commit/1a8463f7d))
- **Servers using plugin WebSocket connections:** Missing private-network protections could expose local services. These connections now receive the same checks. ([Advisory](https://github.com/navidrome/navidrome/security/advisories/GHSA-pr2j-mfc8-qjcc))
- **Login protection:** Login attempt limits could be bypassed, weakening protection against repeated password guesses. This is now fixed. ([#6124](https://github.com/navidrome/navidrome/pull/6124))
- **Server availability:** Artwork and share-image requests could exhaust server memory. Invalid image sizes are now rejected. ([#5847](https://github.com/navidrome/navidrome/pull/5847))
- **Public shares:** A share could stream tracks outside its contents. Streams are now limited to the tracks actually shared. ([#5769](https://github.com/navidrome/navidrome/pull/5769))
- **Share access:** Shared items are now fully validated, and share information is loaded using the owner's access rights. ([#6098](https://github.com/navidrome/navidrome/pull/6098))
- **Login requests:** Oversized login request bodies are now capped to limit resource use. ([#6098](https://github.com/navidrome/navidrome/pull/6098))
- **Log privacy:** New log files have owner-only permissions, and Last.fm authentication tokens are no longer logged. Sensitive authentication headers are also hidden from request logs. ([#6098](https://github.com/navidrome/navidrome/pull/6098), [header fix](https://github.com/navidrome/navidrome/commit/82b9a44a1))
- **Servers using plugins:** Plugin file access is now confined to the assigned folder, and unsafe plugin directory names are rejected. ([#5881](https://github.com/navidrome/navidrome/pull/5881), [#5886](https://github.com/navidrome/navidrome/pull/5886))

Some linked security advisories may remain unavailable until they are published. The fixes are already included in this release.

## Before you upgrade

- **Back up your database.** This release migrates item identifiers throughout the database. Clients that remember those identifiers, including clients with offline downloads, may need to re-sync afterward. ([#5824](https://github.com/navidrome/navidrome/pull/5824))
- **Check plugin compatibility.** Older plugin HTTP support is disabled, so affected plugins need updating. Plugins connecting to local network services also need permission for those addresses in their manifest. ([HTTP changes](https://github.com/navidrome/navidrome/commit/1a8463f7d), [WebSocket changes](https://github.com/navidrome/navidrome/commit/276d767ce))
- **Shares can no longer be created for another user.** If you relied on that behaviour, create shares while signed in as the intended owner instead. ([Fix](https://github.com/navidrome/navidrome/commit/1a8463f7d))
- **Check any negative duration settings.** They are now rejected at startup and must be corrected before Navidrome will start. ([#6002](https://github.com/navidrome/navidrome/pull/6002))

## Try Jellyfin music clients

You can now connect Jellyfin-compatible music clients such as Finamp and Jellify to Navidrome. This support is **experimental** and disabled by default; enable it with `Jellyfin.Enabled = true`. ([#5730](https://github.com/navidrome/navidrome/pull/5730))

{{< release-media id="pr5730-1" alt="Finamp connected to Navidrome with music available to browse" >}}

Supported features include browsing, search, favourites, ratings, playlists, lyrics, Instant Mix and ReplayGain volume normalization, plus filtering by year and record label. ([#5791](https://github.com/navidrome/navidrome/pull/5791), [#5948](https://github.com/navidrome/navidrome/pull/5948), [#5815](https://github.com/navidrome/navidrome/pull/5815), [#5817](https://github.com/navidrome/navidrome/pull/5817), [#5809](https://github.com/navidrome/navidrome/pull/5809))

With a sonic similarity plugin installed, Jellyfin clients can also offer similar tracks and sonic paths. ([#5782](https://github.com/navidrome/navidrome/pull/5782))

## Keep favourite playlists within reach

Playlists now have a heart button, a favourites filter and a favourites-only sidebar toggle. Playlist favourites and ratings are personal to each user. ([#5805](https://github.com/navidrome/navidrome/pull/5805), [#5749](https://github.com/navidrome/navidrome/pull/5749))

{{< release-media id="pr5805-1" alt="Playlist favourites controls in the playlist list and sidebar" >}}

Importing playlists is much faster on large libraries. Smart playlists can also use album-level fields for sorting and filtering. ([#6055](https://github.com/navidrome/navidrome/pull/6055), [#5899](https://github.com/navidrome/navidrome/pull/5899))

Several playlist annoyances are fixed: edits to playlist files are detected, deleting many tracks at once no longer fails, and the playlist refreshes after you rate or love a track. ([#5914](https://github.com/navidrome/navidrome/pull/5914), [#5977](https://github.com/navidrome/navidrome/pull/5977), [#6009](https://github.com/navidrome/navidrome/pull/6009))

## Refresh metadata and browse more comfortably

Album and artist pages, along with their context menus, now offer **Refresh Metadata**. You can request an update directly from the item you are viewing. ([#6036](https://github.com/navidrome/navidrome/pull/6036), [#6078](https://github.com/navidrome/navidrome/pull/6078))

Artwork loads in the background, with a blurred preview shown until the full image arrives. Artist artwork matching from Deezer is also corrected for artists with the same name. ([#5847](https://github.com/navidrome/navidrome/pull/5847), [#5808](https://github.com/navidrome/navidrome/pull/5808))

Optional natural sorting puts names such as “Track 2” before “Track 10.” To use it, set `EnableNaturalSorting = true`; it is off by default. Filtering by genre and artist is also much faster. ([#6015](https://github.com/navidrome/navidrome/pull/6015), [#5940](https://github.com/navidrome/navidrome/pull/5940), [#5930](https://github.com/navidrome/navidrome/pull/5930))

You can choose Artists, Songs, Playlists or Radio as your default view, and your items-per-page choice is remembered across sessions. ([#5754](https://github.com/navidrome/navidrome/pull/5754), [#5801](https://github.com/navidrome/navidrome/pull/5801), [#5819](https://github.com/navidrome/navidrome/pull/5819))

Catppuccin Frappé and Mocha join the theme selection, while Macchiato now follows the official palette more closely. ([#5835](https://github.com/navidrome/navidrome/pull/5835))

{{< release-media id="pr5835-1" alt="Navidrome album grid using the Catppuccin Frappé theme" >}}

## Notable fixes

- Going back to a page restores its scroll position, and closing the expanded disc cover no longer starts playback. ([#5892](https://github.com/navidrome/navidrome/pull/5892), [#5901](https://github.com/navidrome/navidrome/pull/5901))
- Logins no longer sometimes show the wrong user. ([#5882](https://github.com/navidrome/navidrome/pull/5882), [#5767](https://github.com/navidrome/navidrome/pull/5767))
- Opening top menus in Safari no longer resizes the album grid. ([#6125](https://github.com/navidrome/navidrome/pull/6125))
- Music already in a player's forced format is no longer unnecessarily re-encoded, and seeking now works for piped FLAC transcodes. ([#6105](https://github.com/navidrome/navidrome/pull/6105))
- Incomplete transcoded streams are no longer treated as complete, and AAC streams are identified correctly to clients. ([#6035](https://github.com/navidrome/navidrome/pull/6035), [#5998](https://github.com/navidrome/navidrome/pull/5998))
- Out-of-order playback reports are no longer rejected, helping keep listening activity recorded. ([#5793](https://github.com/navidrome/navidrome/pull/5793))

## Credits

[@deluan](https://github.com/deluan) contributed Jellyfin client support, playlist favourites, metadata refresh, artwork loading, natural sorting, performance improvements, security fixes and many of the fixes above.

Thanks to [@kgarner7](https://github.com/kgarner7) for Jellyfin improvements and artwork folder fixes; [@cmyksoda](https://github.com/cmyksoda) for the Catppuccin themes; [@junkerderprovinz](https://github.com/junkerderprovinz) for playlist-file change detection; [@polybjorn](https://github.com/polybjorn) for playlist refresh fixes; [@apkatsikas](https://github.com/apkatsikas) for the login display fix; [@york9675](https://github.com/york9675) for the Safari grid fix; and [@justadityaraj](https://github.com/justadityaraj) for the AAC stream fix.

Thanks to [@Sudo-Ivan](https://github.com/Sudo-Ivan) for reporting and fixing the artist-query vulnerability, and to security researchers [@gigioneggiando](https://github.com/gigioneggiando), [@qrn12580](https://github.com/qrn12580), [@gehan-psbc](https://github.com/gehan-psbc), [@skarn958](https://github.com/skarn958) and [@arpitjain099](https://github.com/arpitjain099) for responsibly reporting vulnerabilities.

For technical details, such as API, plugin and command line changes, read the
[full release notes on GitHub](https://github.com/navidrome/navidrome/releases/tag/v0.64.0).
