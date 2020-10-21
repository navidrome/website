---
title: "Configuration Options"
linkTitle: "Configuration Options"
date: 2017-01-05
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
LogLevel = 'DEBUG'
ScanInterval = '90s'
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

| Option                                                | Env var                      | Description                                                                                                                | Default Value                            |
| ----------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| ConfigFile                                            | `ND_CONFIGFILE`              | Load configurations from an external config file                                                                           | `"./navidrome.toml"`                     |
| MusicFolder                                           | `ND_MUSICFOLDER`             | Folder where your music library is stored. Can be read-only                                                                | `"./music"`                              |
| DataFolder                                            | `ND_DATAFOLDER`              | Folder to store application data (DB, cache...)                                                                            | `"./data"`                               |
| ScanInterval                                          | `ND_SCANINTERVAL`            | How frequently to scan for changes in your music library. Set it to `0` to disable scans                                   | `"1m"`                                   |
| LogLevel                                              | `ND_LOGLEVEL`                | Log level. Useful for troubleshooting. Possible values: `error`, `info`, `debug`, `trace`                                  | `"info"`                                 |
| Port                                                  | `ND_PORT`                    | HTTP port Navidrome will use                                                                                               | `4533`                                   |
| Address                                               | `ND_ADDRESS`                 | IP address the server will bind to                                                                                         | `0.0.0.0` (all IPs)                      |
| EnableTranscodingConfig[\*](/docs/usage/security#transcoding-configuration) | `ND_ENABLETRANSCODINGCONFIG` | Enables transcoding configuration in the UI                                                          | `false`                                  |
| TranscodingCacheSize                                  | `ND_TRANSCODINGCACHESIZE`    | Size of transcoding cache. Set to `0` to disable cache                                                                     | `"100MB"`                                |
| ImageCacheSize                                        | `ND_IMAGECACHESIZE`          | Size of image (art work) cache. Set to `0` to disable cache                                                                | `"100MB"`                                |
| AutoImportPlaylists                                   | `ND_AUTOIMPORTPLAYLISTS`     | Enable/disable `.m3u` playlist auto-import                                                                                 | `true`                                   |
| BaseUrl                                               | `ND_BASEURL`                 | Base URL (only the `path` part) to configure Navidrome behind a proxy (ex: `/music`)                                       | _Empty_                                  |
| UILoginBackgroundUrl                                  | `ND_UILOGINBACKGROUNDURL`    | Change background image used in the Login page                                                                             | _random music image from Unsplash.com_   |
| UIWelcomeMessage                                      | `ND_UIWELCOMEMESSAGE`        | Add a welcome message to the login screen                                                                                  | _Empty_                                  |
| GATrackingID                                          | `ND_GATRACKINGID`            | Send basic info to your own Google Analytics account. Must be in the format `UA-XXXXXXXX`                                  | _Empty_ (disabled)                       |
| IgnoredArticles                                       | `ND_IGNOREDARTICLES`         | List of ignored articles when sorting/indexing artists                                                                     | `"The El La Los Las Le Les Os As O A"`   |
| SearchFullString                                      | `ND_SEARCHFULLSTRING`        | Match query strings anywhere in searchable fields, not only in word boundaries. Useful for languages where words are not space separated | `false`   |
| CoverArtPriority                                      | `ND_COVERARTPRIORITY`        | Configure the order to look for cover art images. Use special `embedded` value to get embedded images from the audio files | `"embedded, cover.*, folder.*, front.*"` |
| CoverJpegQuality                                      | `ND_COVERJPEGQUALITY`        | Set JPEG quality percentage for resized cover art images                                                                   | `75`                                     |
| SessionTimeout                                        | `ND_SESSIONTIMEOUT`          | How long Navidrome will wait before closing web ui idle sessions                                                           | `"24h"`                                  |
| AuthRequestLimit[\*](/docs/usage/security#login-limit-rating)    | `ND_AUTHREQUESTLIMIT`        | How many login requests can be processed from a single IP during the `AuthWindowLength`. Set to `0` to disable the limit rater | `5`                       |
| AuthWindowLength[\*](/docs/usage/security#login-limit-rating)    | `ND_AUTHWINDOWLENGTH`        | Window Length for the authentication rate limit                                                                 | `"20s"`                                  |
| Scanner.Extractor                                     | `ND_SCANNER_EXTRACTOR`       | Select metadata extractor implementation. Options: `taglib` or `ffmpeg`                                                    | `taglib`                                 |
| LastFM.ApiKey                                         | `ND_LASTFM_APIKEY`           | Last.FM ApiKey                                                                                                             | _Empty_                                  |
| LastFM.Secret                                         | `ND_LASTFM_SECRET`           | Last.FM Shared Secret                                                                                                      | _Empty_                                  |
| LastFM.Language                                       | `ND_LASTFM_LANGUAGE`         | [Two letter-code for language](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to be used to retrieve biographies from Last.FM                                               | `"en"`                                   |
| Spotify.ID                                            | `ND_SPOTIFY_ID`              | Spotify Client ID                                                                                                          | _Empty_                                  |
| Spotify.Secret                                        | `ND_SPOTIFY_SECRET`          | Spotify Client Secret                                                                                                      | _Empty_                                  |

#### Notes

- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid
  time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default
  unit is bytes.  Note: "1KB" == "1000", "1KiB" == "1024"
