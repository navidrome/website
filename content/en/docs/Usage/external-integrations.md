---
title: "External Integrations"
linkTitle: "External Integrations"
date: 2017-01-04
weight: 30
description: >
  Configure Navidrome to get information and images from Last.fm and Spotify
aliases:
  - /docs/usage/external_integrations
---

## Last.fm

Navidrome can use Last.fm to retrieve artists biographies, top songs, similar artists and album covers. It can also
send your scrobbles to Last.fm. For these features to work, you'll need to set the 
[config options](/docs/usage/configuration-options/#:~:text=(auto%20detect)-,LastFM.ApiKey,-ND_LASTFM_APIKEY) 
`LastFM.ApiKey` and `LastFM.Secret`. You can obtain these values by creating a free API account in Last.fm:

1) Go to https://www.last.fm/api/account/create and create an API account. Only the _Application Name_ field is mandatory:
<p align="center">
<img width="500" src="/screenshots/lastfm-create-account.png">
</p>

2) After submitting the form, you can get the _API Key_ and _Shared Secret_ from the _Account Created_ page:
<p align="center">
<img width="500" src="/screenshots/lastfm-account-created.png">
</p>

3) Copy the values above to your [configuration file](/docs/usage/configuration-options#configuration-file) as `LastFM.ApiKey` and `LastFM.Secret` (or set them as environment variables `ND_LASTFM_APIKEY` and `ND_LASTFM_SECRET`)


## Spotify

Artist images can be retrieved from Spotify. You'll need to set the config options `Spotify.ID` and `Spotify.Secret`. 
To obtain these values, create a free account in Spotify, then follow these steps:

1) Click on the "Create app" button in Spotify's Developer dashboard: https://developer.spotify.com/dashboard/applications:
<p align="center">
<img width="500" src="/screenshots/spotify-dashboard.png">
</p>

2) Fill the name and description fields, fill the "Redirect URI" field with `http://localhost/` and click on the "Save" button:
<p align="center">
<img width="500" src="/screenshots/spotify-create-app.png">
</p>

3) Go to "Settings":
<p align="center">
<img width="500" src="/screenshots/spotify-app-home.png">
</p>

4) Click "View client secret":
<p align="center">
<img width="500" src="/screenshots/spotify-app-basic-info.png">
</p>

5) Copy the values of ID and secret to your [configuration file](/docs/usage/configuration-options#configuration-file) as `Spotify.ID` and `Spotify.Secret` (or set them as environment variables `ND_SPOTIFY_ID` and `ND_SPOTIFY_SECRET`):
<p align="center">
<img width="500" src="/screenshots/spotify-app-basic-info-secret.png">
</p>
