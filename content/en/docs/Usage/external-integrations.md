---
title: "External Integrations"
linkTitle: "External Integrations"
date: 2017-01-04
description: >
  Configure Navidrome to get information and images from Last.fm and Spotify
aliases:
  - /docs/usage/external_integrations
---

## Spotify

Artist images can be retrieved from Spotify. You'll need to set the config options `Spotify.ID` and `Spotify.Secret`. 
To obtain these values, create a free account in Spotify, then follow these steps:

1) Click on the "Create an App" button in Spotify's Developer dashboard: https://developer.spotify.com/dashboard/applications:
<p align="center">
<img width="500" src="/screenshots/spotify-dashboard.png">
</p>

2) Fill all fields and click on the "Create" button:
<p align="center">
<img width="500" src="/screenshots/spotify-create-app.png">
</p>

3) Copy the values to your [configuration file](/docs/usage/configuration-options#configuration-file) (or set them as environment variables):
<p align="center">
<img width="500" src="/screenshots/spotify-app-created.png">
</p>

## Last.fm

Navidrome can use Last.fm to retrieve artists biographies, artists top songs, similar artists and album covers. 
It works out-of-the-box, but if you want to setup your own API-KEY, follow these steps:

You will need a Last.fm free account, then you'll need to set the config options `LastFM.ApiKey` and `LastFM.Secret`. You can obtain these values by creating an API account in Last.fm:

1) Go to https://www.last.fm/api/account/create and create an API account. Only the _Application Name_ field is mandatory:
<p align="center">
<img width="500" src="/screenshots/lastfm-create-account.png">
</p>

2) After submitting the form, you can get the _API Key_ and _Shared Secret_ from the _Account Created_ page:
<p align="center">
<img width="500" src="/screenshots/lastfm-account-created.png">
</p>

3) Copy the values above to your [configuration file](/docs/usage/configuration-options#configuration-file) (or set them as environment variables)


