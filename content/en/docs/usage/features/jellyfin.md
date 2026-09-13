---
title: "Jellyfin API (Experimental)"
linkTitle: "Jellyfin API"
weight: 70
description: >
  Connect Jellyfin music clients, like Finamp and Jellify, to Navidrome
---

Starting with version 0.64.0, Navidrome can answer a subset of the [Jellyfin](https://jellyfin.org/) API. Music apps built
for Jellyfin can connect to Navidrome and play your library. You do not need a Jellyfin server.

{{< alert color="warning" title="Experimental" >}}
This API is new, and some clients may hit requests that Navidrome does not answer yet. It covers what a music client
needs. Video, live TV and the Jellyfin admin dashboard are not part of it. Please report problems in
[GitHub issues](https://github.com/navidrome/navidrome/issues).
{{< /alert >}}

## Enabling the API

The Jellyfin API is off by default. Turn it on in your [configuration file](/docs/usage/configuration/options/#configuration-file):

```toml
[Jellyfin]
Enabled = true
```

Or with an environment variable:

```bash
ND_JELLYFIN_ENABLED=true
```

Restart Navidrome. The API is now at the `/jellyfin` path of your server, for example `http://192.168.1.10:4533/jellyfin`.
If you set a `BaseURL`, the path goes after it: `https://example.com/music/jellyfin`.

## Connecting a client

We test the API with [Finamp](https://github.com/jmshrv/finamp), [Jellify](https://github.com/Jellify-Music/App) and
[Feishin](https://github.com/jeffvli/feishin). Other Jellyfin music clients may work too.

1) In the client, add a new server.
2) Enter the server address with `/jellyfin` at the end, for example `http://192.168.1.10:4533/jellyfin`.
3) Log in with your Navidrome username and password.

Every client device that connects shows up as a player in **Settings > Players**. If you set a transcoding format on
that player, Navidrome applies it to the Jellyfin streams too. Downloads always send the original file.

{{% alert %}}
When transcoding is on in Finamp, it plays through HLS. HLS can only carry `aac` or `mp3`, so pick one of those if you
force a format on the Finamp player.
{{% /alert %}}

### Login screen user list

Some clients show a list of users on the login screen, so you tap a name and type only the password. Anyone who can
reach your server can see this list without logging in. For that reason Navidrome shows no users by default. To show
some, list their usernames:

```toml
[Jellyfin]
ExposedPublicUsers = "alice, bob"
```

### Sessions

A Jellyfin login token does not expire, same as in Jellyfin. To log a user out of all their Jellyfin clients, change
that user's password. Login attempts count against the same
[login rate limit](/docs/usage/admin/security#limit-login-attempts) as the web UI.

## What works

- **Libraries.** Each Navidrome library the user can access shows up as its own music library in the client.
- **Browsing and search.** Artists, albums, songs, genres and playlists. Clients can filter by year and record label.
- **Favorites and ratings** for songs, albums, artists and playlists.
- **Playlists.** Create, rename, reorder, add and remove tracks, change the cover, and delete. Only the owner can change
  a playlist.
- **Streaming**, with transcoding and ReplayGain.
- **Lyrics**, from the same sources as the web UI (see `LyricsPriority`).
- **Playback reports.** Plays count in Navidrome and scrobble to Last.fm, ListenBrainz and scrobbler plugins.
- **Instant Mix** from a song, album, playlist or genre.
- **Sonic similarity.** With a sonic similarity plugin such as [AudioMuse-AI](/docs/usage/integration/audiomuse/),
  clients get similar tracks and song-to-song paths. Navidrome also answers the AudioMuse-AI endpoints that some
  clients, like [Symfonium](https://symfonium.app/), call when they connect as a Jellyfin client.

## Configuration options

All options go in the `[Jellyfin]` section of the configuration file, or in `ND_JELLYFIN_*` environment variables.

- **`Enabled`** (`ND_JELLYFIN_ENABLED`, default `false`). Turns the Jellyfin API on.
- **`ServerName`** (`ND_JELLYFIN_SERVERNAME`, default `"Navidrome <version>"`). The server name that clients show.
- **`ExposedPublicUsers`** (`ND_JELLYFIN_EXPOSEDPUBLICUSERS`, default empty). Comma-separated usernames to show on the
  client login screen. See [above](#login-screen-user-list).
- **`MaxConcurrentStreams`** (`ND_JELLYFIN_MAXCONCURRENTSTREAMS`, default half the database connection pool, at least
  `2`). How many large list responses Navidrome sends at the same time. Each one holds a database connection until it
  ends, and extra requests wait. The default leaves the other half of the connections for the scanner, scrobbles and
  the web UI. You rarely need to change it.

## Known limitations

- The genre list shows genres from all libraries, not only the ones the user can access.
- While artwork loads, clients show a placeholder in one solid color, not a blurred copy of the cover.
- The client's live connection only keeps the session open. Navidrome does not push events, like library changes, over it.

## Troubleshooting

If a client fails on some screen, it may be calling an endpoint that Navidrome does not answer yet. Set
`LogLevel = "debug"` and look for log lines with `Jellyfin API: unhandled route`. Each one shows the method and path the
client asked for. Add those lines when you open an issue.
