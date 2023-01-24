---
title: "Configuration Options"
linkTitle: "Configuration Options"
date: 2017-01-06
description: >
  How to customize Navidrome to your environment
---

Navidrome allows some customization using environment variables, loading from a configuration file
or using command line arguments.

## Configuration File

Navidrome tries to load the configuration from a `navidrome.toml` file in the current working
directory. You can put any of the [configuration options below](#available-options) in this file.
Example of a configuration file for Windows (should be similar for Linux, just use forward slashes for paths):

```toml
# This is just an example! Please see available options below to customize Navidrome to your needs
LogLevel = 'DEBUG'
ScanSchedule = '@every 1h'
TranscodingCacheSize = '150MiB'
MusicFolder = 'C:\Users\JohnDoe\Music'
```

You can also specify a different path for the configuration file, using the `-c/--configfile` option.
Navidrome can load the configuration from `toml`, `json`, `yml` and `ini` files.

Ex. of usage (Windows):

```bash
C:\> navidrome --configfile "c:\User\johndoe\navidrome.toml"
```

## Command Line Arguments

You can set most of the [config options below](#available-options) passing arguments to `navidrome` executable. Ex:
```bash
C:\> navidrome --musicfolder "c:\User\johndoe\Music"
```

Please note that command line arguments must be **all lowercase**. For a list of all available command line options,
just call `navidrome --help`.


## Environment Variables

Any configuration option can be set as an environment variable, just add a the prefix `ND_` and
make it all uppercase. Ex: `ND_LOGLEVEL=debug`. See below for all available options

## Available Options

### Basic configuration

| In config file | As an env var    | Description                                                                                       | Default Value                |
|----------------|------------------|---------------------------------------------------------------------------------------------------|------------------------------|
|                | `ND_CONFIGFILE`  | Load configurations from an external config file                                                  | `"./navidrome.toml"`         |
| MusicFolder    | `ND_MUSICFOLDER` | Folder where your music library is stored. Can be read-only                                       | `"./music"`                  |
| DataFolder     | `ND_DATAFOLDER`  | Folder to store application data (DB, cache...)                                                   | `"./data"`                   |
| LogLevel       | `ND_LOGLEVEL`    | Log level. Useful for troubleshooting. Possible values: `error`, `warn`, `info`, `debug`, `trace` | `"info"`                     |
| Address        | `ND_ADDRESS`     | IP address the server will bind to                                                                | `0.0.0.0` and `::` (all IPs) |
| BaseUrl        | `ND_BASEURL`     | Base URL (only the `path` part) to configure Navidrome behind a proxy (ex: `/music`)              | _Empty_                      |
| Port           | `ND_PORT`        | HTTP port Navidrome will use                                                                      | `4533`                       |

### Advanced configuration

<!-- This table is easier to be edited when Word Wrap is toggled off. Please keep it sorted -->

| In config file                                 | As an env var                | Description                                                                                                                                                                                        | Default Value                                              |
|------------------------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| AuthRequestLimit[\*][limit-login-attempts]     | `ND_AUTHREQUESTLIMIT`        | How many login requests can be processed from a single IP during the `AuthWindowLength`. Set to `0` to disable the limit rater                                                                     | `5`                                                        |
| AuthWindowLength[\*][limit-login-attempts]     | `ND_AUTHWINDOWLENGTH`        | Window Length for the authentication rate limit                                                                                                                                                    | `"20s"`                                                    |
| AutoImportPlaylists                            | `ND_AUTOIMPORTPLAYLISTS`     | Enable/disable `.m3u` playlist auto-import                                                                                                                                                         | `true`                                                     |
| CoverArtPriority                               | `ND_COVERARTPRIORITY`        | Configure the order to look for cover art images. Use special `embedded` value to get embedded images from the audio files                                                                         | `"embedded, cover.*, folder.*, front.*"`                   |
| CoverJpegQuality                               | `ND_COVERJPEGQUALITY`        | Set JPEG quality percentage for resized cover art images                                                                                                                                           | `75`                                                       |
| DefaultLanguage                                | `ND_DEFAULTLANGUAGE`         | Sets the default language used by the UI when logging in from a new browser. This value must match the [2 letter ISO code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for the language | `en`                                                       |
| DefaultTheme                                   | `ND_DEFAULTTHEME`            | Sets the default theme used by the UI when logging in from a new browser. This value must match one of the options in the UI                                                                       | `Dark`                                                     |
| EnableCoverAnimation                           | `ND_ENABLECOVERANIMATION`    | Controls whether the player in the UI will animate the album cover (rotation)                                                                                                                      | `true`                                                     |
| EnableDownloads                                | `ND_ENABLEDOWNLOADS`         | Enable the option in the UI to download music/albums/artists/playlists from the server                                                                                                             | `true`                                                     |
| EnableExternalServices                         | `ND_ENABLEEXTERNALSERVICES`. | Set this to `false` to completely disable ALL external integrations                                                                                                                                | `true`                                                     |
| EnableFavourites                               | `ND_ENABLEFAVOURITES`        | Enable toggling "Heart"/"Loved" for songs/albums/artists in the UI (maps to "Star"/"Starred" in Subsonic Clients)                                                                                  | `true`                                                     |
| EnableGravatar                                 | `ND_ENABLEGRAVATAR`          | Use [Gravatar](https://gravatar.com/) images as the user profile image. Needs the user's email to be filled                                                                                        | `false`                                                    |
| EnableLogRedacting                             | `ND_ENABLELOGREDACTING`      | Whether or not sensitive information (like tokens and passwords) should be redacted (hidden) in the logs                                                                                           | `true`                                                     |
| EnableStarRating                               | `ND_ENABLESTARRATING`        | Enable 5-star ratings in the UI                                                                                                                                                                    | `true`                                                     |
| EnableTranscodingConfig[\*][transcoding]       | `ND_ENABLETRANSCODINGCONFIG` | Enables transcoding configuration in the UI                                                                                                                                                        | `false`                                                    |
| EnableUserEditing                              | `ND_ENABLEUSEREDITING`       | Enable regular users to edit their details and change their password                                                                                                                               | `true`                                                     |
| GATrackingID                                   | `ND_GATRACKINGID`            | Send basic info to your own Google Analytics account. Must be in the format `UA-XXXXXXXX`                                                                                                          | _Empty_ (disabled)                                         |
| IgnoredArticles                                | `ND_IGNOREDARTICLES`         | List of ignored articles when sorting/indexing artists                                                                                                                                             | `"The El La Los Las Le Les Os As O A"`                     |
| ImageCacheSize                                 | `ND_IMAGECACHESIZE`          | Size of image (art work) cache. Set to `"0"` to disable cache                                                                                                                                      | `"100MB"`                                                  |
| LastFM.ApiKey                                  | `ND_LASTFM_APIKEY`           | Last.fm ApiKey                                                                                                                                                                                     | Navidrome project's shared ApiKey                          |
| LastFM.Enabled                                 | `ND_LASTFM_ENABLED`          | Set this to `false` to completely disable Last.fm integration                                                                                                                                      | `true`                                                     |
| LastFM.Language                                | `ND_LASTFM_LANGUAGE`         | [Two letter-code for language][language-codes] to be used to retrieve biographies from Last.fm                                                                                                     | `"en"`                                                     |
| LastFM.Secret                                  | `ND_LASTFM_SECRET`           | Last.fm Shared Secret                                                                                                                                                                              | Navidrome project's shared Secret                          |
| ListenBrainz.BaseURL                           | `ND_LISTENBRAINZ_BASEURL`    | Set this to override the default ListenBrainz base URL                                                                                                                                             | `https://api.listenbrainz.org/1/`                          |
| ListenBrainz.Enabled                           | `ND_LISTENBRAINZ_ENABLED`    | Set this to `false` to completely disable ListenBrainz integration                                                                                                                                 | `true`                                                     |
| PasswordEncryptionKey[\*][encrypt-passwords]   | `ND_PASSWORDENCRYPTIONKEY`   | Passphrase used to encrypt passwords in the DB. Click [here][encrypt-passwords] for details                                                                                                        | -                                                          |
| PlaylistsPath                                  | `ND_PLAYLISTSPATH`           | Where to search for and import playlists from. Can be a list of folders/globs (separated by `:` (or `;` on Windows). Paths are relative to `MusicFolder`                                           | `".:**/**"` (meaning `MusicFolder` and all its subfolders) |
| Prometheus.Enabled                             | `ND_PROMETHEUS_ENABLED`      | Enable extra endpoint with [Prometheus](https://prometheus.io/docs/introduction/overview/) metrics.                                                                                                | `false`                                                    |
| Prometheus.MetricsPath                         | `ND_PROMETHEUS_METRICSPATH`  | Custom path for Prometheus metrics. Useful for blocking unauthorized metrics requests.                                                                                                             | `"/metrics"`                                               |
| RecentlyAddedByModTime                         | `ND_RECENTLYADDEDBYMODTIME`  | Uses music files' modification time when sorting by "Recently Added". Otherwise use import time                                                                                                    | `false`                                                    |
| ReverseProxyUserHeader[\*][reverse-proxy-auth] | `ND_REVERSEPROXYUSERHEADER`  | HTTP header containing user name from authenticated proxy                                                                                                                                          | `"Remote-User"`                                            |
| ReverseProxyWhitelist[\*][reverse-proxy-auth]  | `ND_REVERSEPROXYWHITELIST`   | Comma separated list of IP CIDRs which are allowed to use reverse proxy authentication, empty means "deny all"                                                                                     | _Empty_                                                    |
| Scanner.Extractor                              | `ND_SCANNER_EXTRACTOR`       | Select metadata extractor implementation. Options: `taglib` or `ffmpeg`                                                                                                                            | `"taglib"`                                                 |
| Scanner.GenreSeparators                        | `ND_SCANNER_GENRESEPARATORS` | List of separators to split genre tags                                                                                                                                                             | `";/,"`                                                    |
| ScanSchedule                                   | `ND_SCANSCHEDULE`            | Configure periodic scans using ["cron" syntax](https://en.wikipedia.org/wiki/Cron). To disable it altogether, set it to `"0"`                                                                      | `"@every 1m"`                                              |
| SearchFullString                               | `ND_SEARCHFULLSTRING`        | Match query strings anywhere in searchable fields, not only in word boundaries. Useful for languages where words are not space separated                                                           | `false`                                                    |
| SessionTimeout                                 | `ND_SESSIONTIMEOUT`          | How long Navidrome will wait before closing web ui idle sessions                                                                                                                                   | `"24h"`                                                    |
| Spotify.ID[\*][spotify-integration]            | `ND_SPOTIFY_ID`              | Spotify Client ID. Required if you want Artist images                                                                                                                                              | _Empty_                                                    |
| Spotify.Secret[\*][spotify-integration]        | `ND_SPOTIFY_SECRET`          | Spotify Client Secret. Required if you want Artist images                                                                                                                                          | _Empty_                                                    |
| TranscodingCacheSize                           | `ND_TRANSCODINGCACHESIZE`    | Size of transcoding cache. Set to `"0"` to disable cache                                                                                                                                           | `"100MB"`                                                  |
| UILoginBackgroundUrl                           | `ND_UILOGINBACKGROUNDURL`    | Change background image used in the Login page                                                                                                                                                     | _random music image from Unsplash.com_                     |
| UIWelcomeMessage                               | `ND_UIWELCOMEMESSAGE`        | Add a welcome message to the login screen                                                                                                                                                          | _Empty_                                                    |

#### Notes

- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid
  time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default
  unit is bytes.  Note: "1KB" == "1000", "1KiB" == "1024"


[limit-login-attempts]: /docs/usage/security#limit-login-attempts  "Login Limit Rating"
[transcoding]:          /docs/usage/security#transcoding-configuration "Transcoding configuration"
[language-codes]:       https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "List of language codes"
[spotify-integration]:  /docs/usage/external-integrations/#spotify
[lastfm-integration]:   /docs/usage/external-integrations/#lastfm
[encrypt-passwords]:    /docs/usage/security/#encrypted-passwords
[reverse-proxy-auth]:   /docs/usage/security/#reverse-proxy-authentication
