---
title: "Jukebox mode"
linkTitle: "Jukebox mode"
date: 2023-10-23
weight: 60
description: >
  Activate Navidrome's Jukebox mode
---

## Introduction

Navidrome's Jukebox feature is a built-in functionality that allows users to play music directly to the server's audio
hardware. This essentially turns your server into a jukebox, enabling you to play songs or playlists remotely through a
supported Subsonic client. With the Jukebox feature, you can control the audio playback in real-time, just like you
would with any other media player. It's a convenient way to enjoy your music collection without the need for
additional hardware or software. Ideal for parties, background music, or personal enjoyment, this feature enhances
the versatility of your Navidrome server setup.

Navidrome's Jukebox mode is based on the OpenSource audio player [MPV](https://mpv.io/). MPV is a mature and tested
audio/videoplayer that is supported on many platforms. Navidrome's Jukebox mode uses MPV for audio playback in
combination with MPV's feature to be controlled through [IPC](https://mpv.io/manual/master/#json-ipc).

## MPV Installation

MPV must be present on the system where the Navidrome server runs. You might find it already installed or could install
it yourself using the methods given on the MPV's [installation page](https://mpv.io/installation/).

The minimal requirement is the IPC support. MPV added IPC support with version 0.7.0 for Linux and macOS and added
Windows support with version 0.17.0. Your OS will most probably include newer versions (0.3X) which we recommend.
After the installation check the version with:

```sh
$ mpv --version
```

Jukebox mode will use the MPV audio device naming scheme for its configuration. To get an overview about the available
audio devices on the system do:

```sh
$ mpv --audio-device=help
```

Here is an example on macOS:

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

Please use the full device name **if you do not want to use MPV's auto device**. For example on macOS:

```sh
"coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1"
```

## Configuration

Jukebox mode is enabled by setting this option in your [configuration file](/docs/usage/configuration-options)
(normally `navidrome.toml`):

```toml
Jukebox.Enabled = true
```

In most cases, this should be the only config option needed.

The MPV binary should be found automatically on the path. In case this does not work use this configuration option:

```toml
MPVPath = "/path/to/mpv"
```

Jukebox mode will use MPV's **auto** device for playback if no device is given.

One can supply an array of multiple devices under `Jukebox.Devices` (note: this config option cannot be set as an environment variable):

```toml
Jukebox.Devices = [
    # "symbolic name " "device"
    [ "internal",     "coreaudio/BuiltInSpeakerDevice" ],
    [ "dac",          "coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1" ]
]
```

and select one by using `Jukebox.Default`:

```toml
Jukebox.Default = "dac"
```

Here is one example configuration:

```toml
# Enable/Disable Jukebox mode
Jukebox.Enabled = true

# List of registered devices, syntax:
#  "symbolic name " - Symbolic name to be used in UI's
#  "device" - MPV audio device name, do mpv --audio-device=help to get a list

Jukebox.Devices = [
    # "symbolic name " "device"
    [ "internal",     "coreaudio/BuiltInSpeakerDevice" ],
    [ "dac",          "coreaudio/AppleUSBAudioEngine:Cambridge Audio :Cambridge Audio USB Audio 1.0:0000:1" ]
]

# Device to use for Jukebox mode, if there are multiple entries above.
# Using device "auto" if missing
Jukebox.Default = "dac"
```

### The `MPVCmdTemplate` / Snapcast integration

There might be cases, where you want to control the call of the `mpv` binary. Noteable mentions would be the integration with Snapcast
for multi room audio. You can use the `MPVCmdTemplate` for this.

The default value is `mpv --audio-device=%d --no-audio-display --pause %f --input-ipc-server=%s`.

| Symbol | Meaning                   |
| ------ | ------------------------- |
| `%s`   | Path to IPC server socket |
| `%d`   | Audio device (see above)  |
| `%f`   | Path to file to play      |

To integrate with Snapcast alter the template:

```toml
MPVCmdTemplate = "mpv --no-audio-display --pause %f --input-ipc-server=%s --audio-channels=stereo --audio-samplerate=48000 --audio-format=s16 --ao=pcm --ao-pcm-file=/tmp/snapfifo"
```

This assumes Snapcast is running on the same machine as Navidrome. Check the [Snapcast documentation](https://github.com/badaix/snapcast/blob/develop/doc/player_setup.md#mpv) for details.

## Usage

Once Jukebox mode is enabled and configured, to start playing music through your servers speakers you'll need to download a third-party
[Subsonic client](https://www.subsonic.org/pages/apps.jsp). This client acts as a remote control.
Not all Subsonic clients support Jukebox mode and you'll need to check that your client supports this feature.

Jukebox mode is currently not supported through the Navidrome Web UI.

## Troubleshooting

If Jukebox mode is enabled one should see the message "**Starting playback server**" in the log. The number of detected audio devices and the device chosen will be given in the log as well:

```log
INFO[0000] Starting playback server
INFO[0000] 4 audio devices found
INFO[0000] Using default audio device: dac
```

For further troubleshooting, set Navidrome's loglevel to DEBUG:

```toml
LogLevel = 'DEBUG'
```
