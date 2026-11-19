---
title: "Scrobbling"
linkTitle: "Scrobbling"
weight: 50
description: >-
     Information on setting up scrobbling with ListenBrainz and Last.fm.
aliases:
  - /docs/usage/scrobbling/
---

Navidrome allows you to easily scrobble your played songs to ListenBrainz and Last.fm.

## ListenBrainz

1) Go to your user profile's Personal Settings.
2) Toggle the option `Scrobble to ListenBrainz`. If you already have a User key generated, skip to step 5.
3) Click on the appropriate link in the pop-up that opens.

<p align="center">
<img width="500" src="/screenshots/listenbrainz-popup.webp">
</p>

4) On the ListenBrainz website, either generate a new token or copy your existing one, then go back to your Navidrome tab.

<p align="center">
<img width="500" src="/screenshots/listenbrainz-token.webp">
</p>

5) Paste the token in the pop-up and save.

If you are using a self-hosted ListenBrainz-compatible server (e.g., [Maloja](https://github.com/krateng/maloja)), you can change the `ListenBrainz.BaseURL` [config option](/docs/usage/configuration/options/#:~:text=ListenBrainz.BaseURL) to point to your instance.

## Last.fm

{{% alert color="warning" title="Last.fm Pro required for API keys" %}}
Starting December 1, 2026, the Last.fm account that owns your Navidrome server’s API key must have Last.fm Pro.
Without a valid key, Navidrome can’t send scrobbles to Last.fm.
Listeners can still use free Last.fm accounts if the server’s key is backed by Pro.
See [External Integrations](/docs/usage/integration/external-services#lastfm) and the [official announcement](https://support.last.fm/t/api-keys-will-require-pro-from-1st-december/121030).
{{% /alert %}}

1) Ensure you have the API Key and API Secret set according to the instructions in [External Integrations](/docs/usage/integration/external-services#lastfm).
2) Go to your user profile's Personal Settings.
3) Toggle the option `Scrobble to Last.fm`, a new browser tab will open directing you to Last.fm.

<p align="center">
<img width="500" src="/screenshots/navidrome-personal-settings.webp">
</p>

4) If you are not logged in, then log in with your Last.fm credentials.

<p align="center">
<img width="500" src="/screenshots/lastfm-login.webp">
</p>

5) Click "Yes, allow access".

<p align="center">
<img width="500" src="/screenshots/lastfm-allow-access.webp">
</p>

## Scrobble Filter

Starting with version 0.64.0, each user can keep some songs out of their scrobbles. Maybe you do not want holiday music
in your Last.fm profile, or you only want songs rated 4 stars or more to shape your recommendations.

The filter uses the same JSON rules as [smart playlists](/docs/usage/features/smart-playlists/). Navidrome does not send
matching songs to Last.fm, ListenBrainz or scrobbler plugins. It still counts the play locally, so play counts and
[scrobble history](#scrobble-history) stay complete.

To set a filter, edit the user and paste the rules in the **Scrobble filter** field. Admins can do this for any user in
**Settings > Users**. Regular users can set their own filter from their profile, if
[`EnableUserEditing`](/docs/usage/configuration/options/#:~:text=EnableUserEditing) is on. Leave the field empty to
scrobble everything.

Skip songs with the genre "Christmas":

```json
{"all":[{"is":{"genre":"Christmas"}}]}
```

Skip songs rated below 4 stars. Unrated songs have a rating of 0, so this skips them too:

```json
{"all":[{"lt":{"rating":4}}]}
```

Skip everything in one library:

```json
{"all":[{"is":{"library_id":3}}]}
```

The filter checks one song at a time, so `limit`, `limitPercent`, `offset` and `refreshDelay` make no sense here.
Navidrome rejects rules that use them, and rules with unknown fields.

## Scrobble History

Starting with version 0.59.0, Navidrome tracks your scrobble/listen history natively. This means that for music added after this version, Navidrome maintains a complete record of when each track was played. This historical data will be used in future features such as statistics and analytics ("Navidrome Wrapped" style reports).

{{% alert color="info" %}}
**Note:** For music that was added before version 0.59.0, the scrobble history will start from the moment you upgrade. The total count of scrobbles per song may not match the song's playcount for tracks that were already in your library before the upgrade.
{{% /alert %}}
