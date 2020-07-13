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
directory. Example of a configuration file:

```toml
LogLevel = "INFO"
BaseURL = "/music"
ScanInterval = "10s"
TranscodingCacheSize = "15MB"
MusicFolder = "/Media/Music"
```

You can also specify a different path for the configuration file, using the `-c` option.
Navidrome can load the configuration from `toml`, `json`, `yml` and `ini` files.

Ex. of usage (Windows):

```bash
C:\> navidrome -c "c:\User\johndoe\navidrome.toml"
```

## Enviroment Variables

Any configuration option can be set as an environment variable, just add a the prefix `ND_` and
make it all uppercase. Ex: `ND_LOGLEVEL=debug`. See below for all available options

## Available Options

| Option                                                | Env var                      | Description                                                                                                                | Default Value                            |
| ----------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| ConfigFile                                            | `ND_CONFIGFILE`              | Load configurations from an external config file                                                                           | `"./navidrome.toml"`                     |
| MusicFolder                                           | `ND_MUSICFOLDER`             | Folder where your music libraryis stored. Can be read-only                                                                 | `"./music"`                              |
| DataFolder                                            | `ND_DATAFOLDER`              | Folder to store application data (DB, cache...)                                                                            | `"./data"`                               |
| ScanInterval                                          | `ND_SCANINTERVAL`            | How frequently to scan for changes in your music library. Set it to `0` to disable scans                                    | `"1m"`                                   |
| LogLevel                                              | `ND_LOGLEVEL`                | Log level. Useful for troubleshooting. Possible values: `error`, `info`, `debug`, `trace`                                  | `"info"`                                 |
| Port                                                  | `ND_PORT`                    | HTTP port Navidrome will use                                                                                               | `4533`                                 |
| EnableTranscodingConfig[\*](#security-considerations) | `ND_ENABLETRANSCODINGCONFIG` | Enables transcoding configuration in the UI                                                                                | `false`                                  |
| TranscodingCacheSize                                  | `ND_TRANSCODINGCACHESIZE`    | Size of transcoding cache                                                                                                  | `"100MB"`                                |
| ImageCacheSize                                        | `ND_IMAGECACHESIZE`          | Size of image (art work) cache. Set to `0` to disable cache                                                                | `"100MB"`                                |
| SessionTimeout                                        | `ND_SESSIONTIMEOUT`          | How long Navidrome will wait before closing web ui idle sessions                                                           | `"24h"`                                  |
| BaseUrl                                               | `ND_BASEURL`                 | Base URL (only the `path` part) to configure Navidrome behind a proxy (ex: `/music`)                                       | _Empty_                                  |
| UiLoginBackgroundUrl                                  | `ND_UILOGINBACKGROUNDURL`    | Change backaground image used in the Login page                                                                            | _random music image from Unsplash.com_   |
| UIWelcomeMessage                                      | `ND_UIWELCOMEMESSAGE`        | Add a welcome message to the login screen | _Empty_                                  |
| GATrackingID                                          | `ND_GATRACKINGID`            | Send basic info to your own Google Analytics account. Must be in the format `UA-XXXXXXXX` | _Empty_ (disabled)
| IgnoredArticles                                       | `ND_IGNOREDARTICLES`         | List of ignored articles when sorting/indexing artists                                                                     | `"The El La Los Las Le Les Os As O A"`   |
| CoverArtPriority                                      | `ND_COVERARTPRIORITY`        | Configure the order to look for cover art images. Use special `embedded` value to get embedded images from the audio files | `"embedded, cover.*, folder.*, front.*"` |
| CoverJpegQuality                                      | `ND_COVERJPEGQUALITY`        | Set JPEG quality for resized cover art images                                                                              | `75`                                     |

#### Notes

- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid
  time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default
  unit is bytes.  Note: "1KB" == "1000", "1KiB" == "1024"

## Security Considerations

To configure transcoding, Navidrome's WebUI provide a screen that allows you to edit existing
transcoding configurations and to add new ones. That is similar to other music servers available
in the market that provide transcoding on-demand.

The issue with this is that it potentially allows an attacker to run any command in your server.
This married with the fact that some Navidrome installations don't use SSL and/or run it as a
super-user (_root_ or _Administrator_), is a recipe for disaster!

In an effort to make Navidrome as secure as possible, we decided to disable the transcoding
configuration editing in the UI by default. If you need to edit it (add or change a configuration),
start Navidrome with the `ND_ENABLETRANSCODINGCONFIG` set to `true`. After doing your changes,
don't forget to remove this option or set it to `false`.
