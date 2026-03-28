---
title: "External Integrations"
linkTitle: "External Integrations"
date: 2017-01-04
weight: 10
description: >
  Configure Navidrome to get information and images from Last.fm and Deezer
aliases:
  - /docs/usage/external-integrations/
---

## Last.fm

Navidrome can use Last.fm to retrieve artists biographies, top songs, similar artists and album covers. It can also
send your scrobbles to Last.fm. For these features to work, you'll need to set the
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

## Deezer

Navidrome can use Deezer's API to retrieve artist images. Unlike Last.fm, Deezer's public API for artist images doesn't require API keys or authentication, making it the simplest external integration to set up.

The Deezer integration is enabled by default. If you want to disable it, you can set the configuration option `Deezer.Enabled` to `false` in your [configuration file](/docs/usage/configuration/options#configuration-file) or set the environment variable `ND_DEEZER_ENABLED` to `false`.

## Extending with Plugins

Navidrome's external metadata capabilities can be extended through [plugins](/docs/usage/features/plugins). Plugins can provide additional metadata agents for artist information and images, lyrics providers, and scrobblers. See the [Plugins documentation](/docs/usage/features/plugins) for more information.
