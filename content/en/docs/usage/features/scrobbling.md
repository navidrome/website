---
title: "Scrobbling"
linkTitle: "Scrobbling"
weight: 50
description: >-
     Information on setting up scrobbling with Last.fm and ListenBrainz.
aliases:
  - /docs/usage/scrobbling/
---

Navidrome allows you to easily scrobble your played songs to Last.fm and ListenBrainz.

## Last.fm

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

## ListenBrainz

1) Toggle the option `Scrobble to ListenBrainz`. If you already have a User key generated, skip to step 4.
2) Click on the appropriate link in the pop-up that opens.

<p align="center">
<img width="500" src="/screenshots/listenbrainz-popup.webp">
</p>

3) On the ListenBrainz website, either generate a new token or copy your existing one, then go back to your Navidrome tab.

<p align="center">
<img width="500" src="/screenshots/listenbrainz-token.webp">
</p>

4) Paste the token in the pop-up and save.

## Scrobble History

Starting with version 0.59.0, Navidrome tracks your scrobble/listen history natively. This means that for music added after this version, Navidrome maintains a complete record of when each track was played. This historical data will be used in future features such as statistics and analytics ("Navidrome Wrapped" style reports).

{{< alert color="info" >}}
**Note:** For music that was added before version 0.59.0, the scrobble history will start from the moment you upgrade. The total count of scrobbles per song may not match the song's playcount for tracks that were already in your library before the upgrade.
{{< /alert >}}
