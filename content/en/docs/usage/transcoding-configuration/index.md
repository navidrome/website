---
title: Transcoding Configuration
linkTitle: transcoding-configuration
date: 2024-12-21
description: >
  Information on how to configure transcoding
---

> You can set the transcoding for each player from the web. Settings > Players has all the players listed. Choose the player you want to configure and change the transcoding settings. If you set it to mp3, my understanding is everything will be transcoded to mp3 for that player.
[Original Answer by arsaboo](https://github.com/navidrome/navidrome/discussions/2326)




- Transcoding can be required in some situations. For example: trying to play
  a [WMA](https://en.wikipedia.org/wiki/Windows_Media_Audio) file in a webbrowser, will **only** work for natively
  supported formats by the browser you are using. (so playing that with Mozilla Firefox on Linux, will not work. Mozilla
  even has their [own guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs) about audio
  codecs).
from [Configuration Options Notes](docs/usage/configuration-options/#notes)

Example: Browsers do not support `.AIFF` 

## Configuring transcoding using the navidrome.toml
In the navidrome.toml you can change the [basic configuration](https://www.navidrome.org/docs/usage/configuration-options/#basic-configuration) Some options however need to be written to the database, which can be achieved using the webui

### `EnableTranscodingConfig`[\*][transcoding]

### `TranscodingCacheSize`
size of the transcoding folder, located in <CacheFolder>/transcoding

## Transcoding Options in the Web UI

## `AutoTranscodeDownload`
> if we are not provided a format, see if we have requested transcoding for this client
> This must be enabled via a config option. For the UI, we are always given an option.
> This will impact other clients which do not use the UI

[Source](https://github.com/navidrome/navidrome/blob/master/server/subsonic/stream.go)


## Enable transcoding for a player
Trough the webui you can specify if one of your clients schould use transcoding:
- Navigate to the player overview 

{{< imgproc player_overview Fit "2000x2000" />
- After you can select a player and configure the transcoding (`format`) and Downsampling (`maxBitRate`) options: 

{{< imgproc player_options Fit "2000x2000" />}}

> If no format is specified and no transcoding associated to the player, but a bitrate is specified,
> and there is no transcoding set for the player, we use the default downsampling format.
> But only if the requested bitRate is lower than the original bitRate.
[Source](https://github.com/navidrome/navidrome/blob/master/core/media_streamer.go)

## Transcoding Configuration
If you set `EnableTranscodingConfig` to `true` you can change the transcoding options from the webui 
{{< imgproc transcoding_options Fit "2000x2000" />}}

## Default Transcoding Settings
If you messed up the defaults can be found in the [consts/consts.go](https://github.com/navidrome/navidrome/blob/master/consts/consts.go) Source.
As of writing this they are:

```text
Name:           "mp3 audio"
TargetFormat:   "mp3"
DefaultBitRate: 192
Command:        "ffmpeg -i %s -ss %t -map 0:a:0 -b:a %bk -v 0 -f mp3 -"

Name:           "opus audio"
TargetFormat:   "opus"
DefaultBitRate: 128
Command:        "ffmpeg -i %s -ss %t -map 0:a:0 -b:a %bk -v 0 -c:a libopus -f opus -"

Name:           "aac audio"
TargetFormat:   "aac"
DefaultBitRate: 256
Command:        "ffmpeg -i %s -ss %t -map 0:a:0 -b:a %bk -v 0 -c:a aac -f adts -"
```

## File Formats

In order to help you decide wether you need transcoding, here are two lists of file extensions.
Navidrome uses a patched version of [lijinke666/react-music-player](https://github.com/lijinke666/react-music-player) from where the firt list stems. [Fork](https://github.com/navidrome/react-music-player)

### Might be Supported
- JPG
- JPEG
- PNG
- GIF
- EOT
- OTF
- WEBP
- SVG
- TTF
- WOFF
- WOFF2
- MP4
- WEBM
- WAV
- MP3
- M4A
- AAC
- OGA

[Source](https://github.com/lijinke666/react-music-player/blob/master/jest.config.js)

### Probably need transcoding

- 3GP (Third Generation Partnership Project)
- 8SVX (IFF-8SVX)
- ACT (Adaptive Differential Pulse Code Modulation)
- ADTS (Audio Data Transport Stream)
- AIFF (Audio Interchange File Format)
- ATRAC (Adaptive Transform Acoustic Coding)
- AWB (Adaptive Multi-Rate Wideband)
- DSS (Digital Speech Standard)
- DVF (Digital Voice File)
- GSM (Global System for Mobile Communications)
- Monkey's Audio (APE)
- MSV (Memory Stick Voice)
- Shorten (SHN)
- TTA (True Audio)
- Vox (Dialogic ADPCM)
- WavPack (WV)
- Windows Media Audio Lossless (WMA Lossless)
- Windows Media Audio Lossy (WMA)

_yes i asked a [llm](https://chatgpt.com/) for this list_

## Additional Resources

https://caniuse.com/?search=audio%20format
