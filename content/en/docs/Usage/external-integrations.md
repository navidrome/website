---
title: "External Integrations"
linkTitle: "External Integrations"
date: 2017-01-05
description: >
  Configure Navidrome to get information and images from Last.fm and Spotify
aliases:
  - /docs/usage/external_integrations
---

## Last.fm

Navidrome can use Last.fm to retrieve artists biographies, top songs and similar artists. It also allows its users to "scrobble" songs using their own Last.fm accounts. As an administrator of the Navidrome server you also need a Last.fm account, which can be created free of charge.
You'll need to set the config options `LastFM.ApiKey` and `LastFM.Secret`. You can obtain these values by creating an "application"/API account in Last.fm:

1) Go to https://www.last.fm/api/account/create and create an API account. Only the _Application Name_ field is mandatory:
<p align="center">
<img width="500" src="/screenshots/lastfm-create-account.png">
</p>

2) After submitting the form, you can get the _API Key_ and _Shared Secret_ from the _Account Created_ page:
<p align="center">
<img width="500" src="/screenshots/lastfm-account-created.png">
</p>

3) Copy the values above to your [configuration file](/docs/usage/configuration-options#configuration-file) (or set them as environment variables)

### Scrobbling

Any user of the Navidrome installation who wants the songs that they play to be scrobbled to their Last.fm should:

1) Log in to the Navidrome web interface

2) Go to Personal settings

3) Enable "Scrobble to Last.fm" and be directed to Last.fm

4) Log in to their Last.fm account (if not already logged in), and allow the "application" created above to access their account.

5) Songs played in Navidrome's web interface will now be scrobbled. If other clients are used, they need to support scrobbling. In some cases scrobbling needs to be enabled in the client's settings, for example in Ultrasonic for Android.

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
