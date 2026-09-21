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
Jellyfin.Enabled = true
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

### Finding the server on your network

Some clients can find Jellyfin servers on your local network, so you do not have to type the address. Navidrome can
answer these searches. This is off by default, because a real Jellyfin server on the same machine uses the same port.
Turn it on with:

```toml
Jellyfin.AutoDiscovery = true
```

Navidrome then listens on UDP port 7359. If another program already uses that port, Navidrome logs a warning and keeps
running without discovery.

The client gets the address from your `BaseURL`, if it has a host. If not, Navidrome sends its own IP address and
`Port`. If Navidrome listens only on one IP address (`Address`) and clients cannot reach that IP, set `BaseURL` to the
address clients should use.

#### Docker

Clients find the server with a broadcast message. On Linux, Docker does not send broadcast messages to a container in
the default (bridge) network mode, even if you publish port 7359. You must use host networking:

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    network_mode: host
    environment:
      ND_JELLYFIN_ENABLED: "true"
      ND_JELLYFIN_AUTODISCOVERY: "true"
    # ...keep your user, volumes and other settings
```

With the `docker` command line tool, use `--network host`.

With host networking, Docker ignores the `ports` section. Navidrome uses the ports of the host directly: `4533` for the
web UI and API, and UDP `7359` for discovery. Navidrome also sees the real IP of the host, so you do not need to set
`BaseURL` for discovery.

If you cannot use host networking, turn auto-discovery off and type the server address in the client.

{{< alert color="warning" >}}
Keep UDP port 7359 on your local network. Do not forward it from the internet.
{{< /alert >}}

### Quick Connect

Quick Connect lets you log in a new device without typing your password on it. It is on by default.

1) In the client, choose **Quick Connect**. The client shows a 6-digit code.
2) In the Navidrome web UI, open the user menu (top right) and click **Quick Connect**. You can also use a Jellyfin
   client where you are already logged in.
3) Type the code. Navidrome shows the app and the device that asked for it. Check that you know them, then approve.
4) The client logs in with your user.

A code expires after 10 minutes, or when Navidrome restarts. Each code logs in one time only. Approving codes counts
against the same [login rate limit](/docs/usage/admin/security#limit-login-attempts) as a normal login.

To turn Quick Connect off:

```toml
Jellyfin.QuickConnect = false
```

### Login screen user list

Some clients show a list of users on the login screen, so you tap a name and type only the password. Anyone who can
reach your server can see this list without logging in. For that reason Navidrome shows no users by default. To show
some, list their usernames:

```toml
Jellyfin.ExposedPublicUsers = "alice, bob"
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

- **`Jellyfin.Enabled`** (`ND_JELLYFIN_ENABLED`, default `false`). Turns the Jellyfin API on.
- **`Jellyfin.ServerName`** (`ND_JELLYFIN_SERVERNAME`, default `"Navidrome <version>"`). The server name that clients
  show.
- **`Jellyfin.ExposedPublicUsers`** (`ND_JELLYFIN_EXPOSEDPUBLICUSERS`, default empty). Comma-separated usernames to show
  on the client login screen. See [above](#login-screen-user-list).
- **`Jellyfin.AutoDiscovery`** (`ND_JELLYFIN_AUTODISCOVERY`, default `false`). Answers Jellyfin client searches on the
  local network (UDP port 7359). See [above](#finding-the-server-on-your-network).
- **`Jellyfin.QuickConnect`** (`ND_JELLYFIN_QUICKCONNECT`, default `true`). Lets users log in new devices with a 6-digit
  code. See [above](#quick-connect).
- **`Jellyfin.MaxConcurrentStreams`** (`ND_JELLYFIN_MAXCONCURRENTSTREAMS`, default half the database connection pool, at least
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
