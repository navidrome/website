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
| `ND_ENABLETRANSCODINGCONFIG`[*](#-security-considerations) | Enables transcoding configuration in the UI | false |
| `ND_TRANSCODINGCACHESIZE` | Size of transcoding cache| 100MB |
| `ND_IMAGECACHESIZE` | Size of image (art work) cache. set to `0` to disable cache | 100MB |
| `ND_SESSIONTIMEOUT` | How long Navidrome will wait before closing web ui idle sessions | 30m |
| `ND_BASEURL` | Base URL (only the `path` part) to configure Navidrome behind a proxy (ex: `/music`) | _Empty_  |
| `ND_UILOGINBACKGROUNDURL` | Change backaground image used in the Login page | https://source.unsplash.com/random/1600x900?music |

### Notes
- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid 
time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default 
unit is bytes (i.e. "1KB" == "1000", "1KiB" == "1024")

### * Security Considerations
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
