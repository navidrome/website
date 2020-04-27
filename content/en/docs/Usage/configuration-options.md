---
title: "Configuration Options"
linkTitle: "Configuration Options"
date: 2017-01-05
description: >
  How to customize Navidrome to your environment
---

Navidrome allows some customization using environment variables. These are the options
available:

| Option            | Description           | Default Value |
|-------------------|-----------------|------|
| `ND_MUSICFOLDER`   | Folder where your music libraryis stored. Can be read-only   | ./music |
| `ND_DATAFOLDER`    | Folder to store application data (DB, cache...)     | ./data |
| `ND_SCANINTERVAL`   | How frequently to scan for changes in your music library  | 1m |
| `ND_LOGLEVEL`   | Log level. Useful for troubleshooting. Possible values: `error`, `info`, `debug`, `trace` | `info` |
| `ND_PORT`          | HTTP port Navidrome will use | 4533 |
| `ND_TRANSCODINGCACHESIZE` | Size of transcoding cache| 100MB |
| `ND_IMAGECACHESIZE` | Size of image (art work) cache. set to `0` to disable cache | 100MB |
| `ND_SESSIONTIMEOUT` | How long Navidrome will wait before closing web ui idle sessions | 30m |
| `ND_BASEURL` | Base URL to configure Navidrome behind a proxy (ex: /music) | _Empty_  |
| `ND_UILOGINBACKGROUNDURL` | Change backaground image used in the Login page | https://source.unsplash.com/random/1600x900?music |

### Notes
- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid 
time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default 
unit is bytes (i.e. "1KB" == "1000", "1KiB" == "1024")
