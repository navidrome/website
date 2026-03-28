---
title: "External Integrations (A.K.A. Agents)"
linkTitle: "External Integrations (Agents)"
date: 2017-01-04
weight: 10
description: >
  Configure Navidrome to get information and images from external services
aliases:
  - /docs/usage/external-integrations/
---

Navidrome uses external services (through **agents**) to enrich your music library with artist biographies, images, album covers, similar artists, and more. Multiple agents can be configured, and they are tried in priority order — if one fails or returns no results, the next one is tried.

## How Agents Work

The `Agents` [config option](/docs/usage/configuration/options/#:~:text=Agents) controls which agents are enabled and in what order. It accepts a comma-separated list of agent names.

The default is `"deezer,lastfm,listenbrainz"`, meaning Deezer is tried first, then Last.fm, then ListenBrainz. A built-in `local` agent is always appended automatically as a final fallback.

To disable a specific agent, either remove it from the `Agents` list or set its individual `*.Enabled` option to `false`. To disable **all** external integrations at once, set `EnableExternalServices` to `false`.

## Last.fm

Last.fm provides the broadest set of metadata among the built-in agents.

**Provides:** Artist biographies, artist images, similar artists, top songs, album covers, similar songs

**Configuration:** Requires API keys. Set the
[config options](/docs/usage/configuration/options/#:~:text=LastFM.ApiKey*-,ND_LASTFM_APIKEY,-Last.fm%20API)
`LastFM.ApiKey` and `LastFM.Secret`. You can obtain these values by creating a free API account in Last.fm:

1. Go to https://www.last.fm/api/account/create and create an API account. Only the _Application Name_ field is mandatory:
<p align="center">
<img width="500" src="/screenshots/lastfm-create-account.webp">
</p>

2. After submitting the form, you can get the _API Key_ and _Shared Secret_ from the _Account Created_ page:
<p align="center">
<img width="500" src="/screenshots/lastfm-account-created.webp">
</p>

3. Copy the values above to your [configuration file](/docs/usage/configuration/options#configuration-file) as `LastFM.ApiKey` and `LastFM.Secret` (or set them as environment variables `ND_LASTFM_APIKEY` and `ND_LASTFM_SECRET`)
4. After the configuration is done, you can set up [scrobbling](/docs/usage/features/scrobbling#last.fm) for your user.

Last.fm can be completely disabled by setting `LastFM.Enabled` to `false`.

## Deezer

Deezer's public API doesn't require API keys or authentication, making it the simplest external integration.

**Provides:** Artist images, artist biographies, similar artists, top songs

**Configuration:** Enabled by default — no setup required. To disable it, set `Deezer.Enabled` to `false` in your [configuration file](/docs/usage/configuration/options#configuration-file) or set the environment variable `ND_DEEZER_ENABLED` to `false`.

## ListenBrainz

ListenBrainz provides metadata based on MusicBrainz data and community listening statistics. It works best when your music files have MusicBrainz IDs in their tags.

**Provides:** Artist URLs, similar artists, top songs, similar songs

**Configuration:** Enabled by default — no setup required for metadata. To disable it, set `ListenBrainz.Enabled` to `false`. The `ListenBrainz.BaseURL` option can be changed to point to a self-hosted instance (e.g., [Maloja](https://github.com/krateng/maloja)).

ListenBrainz also supports [scrobbling](/docs/usage/features/scrobbling#listenbrainz), which requires per-user authorization.

## Local Agent

The `local` agent is always active and serves as the final fallback. It provides top songs based on your own library's play counts and ratings — no external service is contacted.

## Extending with Plugins

Navidrome's external metadata capabilities can be extended through [plugins](/docs/usage/features/plugins#finding-plugins). Plugins can provide additional metadata agents for artist and album information and images, lyrics providers, and scrobblers. See the [Plugins documentation](/docs/usage/features/plugins) for more information.
