---
title: "Jukebox mode"
linkTitle: "Jukebox mode"
date: 2023-10-23
weight: 60
description: >
  Activate Navidrome's Jukebox mode
---

## Introduction

Navidrome's Jukebox mode is based on the opensource audioplayer [MPV](https://mpv.io/). MPV is a mature and tested audio/videoplayer 
that is supported on many platforms. Navidrome's Jukebox mode uses mpv for audio playback in combination with mpv's feature to be
controlled through [IPC](https://mpv.io/manual/master/#json-ipc).

## MPV Installation

MPV must be present on the system where the navidrome server runs. You might find it already installed or could install it yourself using the methods given on the MPV's [installation page](https://mpv.io/installation/).

The minimal requirement is the IPC support. MPV added IPC support with version 0.7.0 for linx and MacOS and added Windows support with version 0.17.0.
Your OS will most probably include newer versions (0.3X) which we recommend. After the installation check the version with:

```sh
$ mpv --version
```

Jukebox mode will use the mpv audiodevice naming scheme for it's configuration. To get an overview about the available audio devices on the system do:

```sh
$ mpv --audio-device=help
```

Here is an example on MacOS:

```sh
List of detected audio devices:
  'auto' (Autoselect device)
  'coreaudio/AppleGFXHDAEngineOutputDP:10001:0:{D109-7950-00005445}' (BenQ EW3270U)
  'coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1' (Cambridge Audio USB 1.0 Audio Out)
  'coreaudio/BuiltInSpeakerDevice' (MacBook Pro-Lautsprecher)
```

or on Linux:

```sh
List of detected audio devices:
  'auto' (Autoselect device)
  'alsa' (Default (alsa))
  'alsa/jack' (JACK Audio Connection Kit)
  'alsa/default:CARD=Headphones' (bcm2835 Headphones, bcm2835 Headphones/Default Audio Device)
   
  ...

  'jack' (Default (jack))
  'sdl' (Default (sdl))
  'sndio' (Default (sndio))
```

Please use the full device name **if you do not want to use MPV's auto device**. For example on MacOS:

```sh
"coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1"
```

## Configuration

Jukebox mode is enabled by setting this option in your configuration file (normally navidrome.toml):

```yml
Jukebox.Enabled = true
```

In most cases, this should be the only config option needed.

The MPV binary should be found automatically on the path. In case this does not work use this configuration option:

```yml
MPVPath = "/path/to/mpv"
```

Jukebox mode will use MPV's **auto** device for playback if no device is given.

One can supply an array of multiple devices under Jukebox.Devices:

```yml
Jukebox.Devices = [
    # "symbolic name " "device"
    [ "internal",     "coreaudio/BuiltInSpeakerDevice" ],
    [ "dac",          "coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1" ]
]
```

and select one by using Jukebox.Default:

```yml
Jukebox.Default = "dac"
```

Here is one example configuration:

```yml
# Enable/Disable Jukebox mode
Jukebox.Enabled = true

# List of registered devices, syntax:
#  "symbolic name " - Symbolic name to be used in UI's
#  "device" - mpv audio device name, do mpv --audio-device=help to get a list

Jukebox.Devices = [
    # "symbolic name " "device"
    [ "internal",     "coreaudio/BuiltInSpeakerDevice" ],
    [ "dac",          "coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1" ]
]

# Device to use for Jukebox mode, if there are multiple entries above.
# Using device "auto" if missing
Jukebox.Default = "dac"
```

## Troubleshooting

If Jukebox mode is enable one should see the message "**Starting playback server**" in the log. The number of detected audio devices and the device choosen will be given in the log as well:

```log
INFO[0000] Starting playback server
INFO[0000] 4 audio devices found
INFO[0000] Using default audio device: dac
```

For further troubleshooting, set Navidrome's loglevel to DEBUG:

```yml
LogLevel = 'DEBUG'
```