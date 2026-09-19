---
title: "Podcasts"
linkTitle: "Podcasts"
weight: 45
description: >
  Subscribe to RSS feeds, download episodes, and browse podcasts with full Podcasting 2.0 support
---

Navidrome can subscribe to podcast RSS feeds, download episodes to your server, and let you (and
your users) browse and play them just like any other media in your library. It also understands
the [Podcasting 2.0 namespace](https://podcastindex.org/namespace/1.0), so chapters, transcripts,
funding links, and other modern podcast metadata show up alongside the audio itself.

### Adding a Podcast

Open the **Podcasts** page from the sidebar, click **Add**, and paste a feed URL. Navidrome fetches
and previews the feed (title, cover art, episode count) before you commit, and warns you if you've
already subscribed to that feed.

Adding, refreshing, and removing channels - and deleting or downloading individual episodes - are
admin-only actions, both in the UI and over the Subsonic API. Any signed-in user can browse and
play episodes from channels an admin has already added.

### Downloading and Playing Episodes

Click **Download** on an episode to fetch it to the server; a live progress percentage streams to
the UI in real time (no polling or manual refresh needed) via server-sent events. Once downloaded,
episodes play back exactly like any other track - click the row, or use **Play**, **Shuffle**,
**Play Next**, or **Add to Queue** from the channel page. Downloaded episodes can also be added to
playlists, where they link back to their channel page.

Outbound requests the server makes on your behalf - fetching a feed for preview/refresh, or
downloading an episode's enclosure - only follow plain `http`/`https` URLs whose resolved address
isn't a loopback, private, link-local, or other internal/reserved address, so a malicious feed
can't be used to make Navidrome probe your internal network.

### Podcasting 2.0 Support

Navidrome implements most of the [Podcasting 2.0 namespace](https://podcastindex.org/namespace/1.0):

- `podcast:guid`, `podcast:season` / `episode`, `podcast:medium`
- `podcast:chapters` and `podcast:transcript` (multiple transcripts per episode, with language and
  relation)
- `podcast:person` (channel- and episode-level), `podcast:funding`, `podcast:locked`
- `podcast:soundbite`, `podcast:updateFrequency`, `podcast:podroll`
- `podcast:liveItem` (with a fallback playback link once the live stream ends)
- `podcast:podping` - a channel with `podcast:podping` skips its normal scheduled-refresh
  interval, since it's expected to be notified of updates via the Podping network instead
- `podcast:images`, `podcast:location`, `podcast:license`, `podcast:publisher`

None of this requires configuration - Navidrome reads whatever tags a feed provides and ignores the
rest.

### Subsonic / OpenSubsonic API

Podcasts are also available over the Subsonic API, for any client that supports it:
`getPodcasts`, `getNewestPodcasts`, `getPodcastEpisode` (read-only, any user), and
`createPodcastChannel`, `refreshPodcasts`, `deletePodcastChannel`, `deletePodcastEpisode`,
`downloadPodcastEpisode` (admin-only, matching the UI's permission model).
