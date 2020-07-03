---
title: "Pre-built Binaries"
linkTitle: "Pre-built Binaries"
date: 2017-01-05
description: >
  Ready to use binaries for all major platforms
---

Just head to the [releases page](https://github.com/deluan/navidrome/releases) and download the latest version for you 
platform. There are builds available for Linux (amd64 and arm), Windows (32 and 64 bits) and macOS.

For [Raspberry Pi](https://www.raspberrypi.org), use the Linux arm builds. Tested with 
[Raspbian](https://www.raspberrypi.org/downloads/raspbian) Buster on Pi 4

Remember to install [ffmpeg](https://ffmpeg.org/download.html) in your system, a requirement for Navidrome to work 
properly. You may find the latest static build for your platform here: https://johnvansickle.com/ffmpeg/ 

If you have any issues with these binaries, or need a binary for a different platform, please 
[open an issue](https://github.com/deluan/navidrome/issues) 

### Arch Linux Packages

You can install Navidrome via the
[`navidrome-bin`](https://aur.archlinux.org/packages/navidrome-bin/) package in
the [AUR](https://aur.archlinux.org/). Alternatively, you can install using the
[`navidrome-git`](https://aur.archlinux.org/packages/navidrome-git/) package
which will compile Navidrome from source.

### Ubuntu Installation

The following steps have been tested on Ubuntu 18.04 and should work on all version 16.04 and above as well as other Debian based distros. Throughout these instructions the commands will have placeholders for the user (`<user>`) and group (`<group>`) you want to run Navidrome under and the music folder path (`<library_path>`). If you are using an existing media library ensure the user has permissions to the media library.

#### Update and Install Prerequisites

Ensure your system is up to date and install [ffmpeg](https://ffmpeg.org/download.html).

```
sudo apt update
sudo apt upgrade
sudo apt install vim ffmpeg
```

#### Create Directory Structure

Create a directory to store the Navidrome executable and a working directory with the proper permissions.

```
sudo install -d -o <user> -g <group> /opt/navidrome
sudo install -d -o <user> -g <group> /var/lib/navidrome
```

#### Get Navidrome

Download the latest release from the [releases page](https://github.com/deluan/navidrome/releases), extract the contents to the executable directory, and set the permissions for the files.

```
wget https://github.com/deluan/navidrome/releases/download/v0.19.0/navidrome_0.19.0_Linux_x86_64.tar.gz -O Navidrome.tar.gz
sudo tar -xvzf Navidrome.tar.gz -C /opt/navidrome/
sudo chown -R <user>:<group> /opt/navidrome
```

#### Create Configuration File

In the working directory, `/var/lib/navidrome` create a new file named `navidrome.toml` with the following settings.

```
MusicFolder = "<library_path>"
```

For addition configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

#### Create a Systemd Unit

Create a new file under `/etc/systemd/system/` named `navidrome.service` with the following data.

```
[Unit]
Description=Navidrome Music Server and Streamer compatible with Subsonic/Airsonic
After=remote-fs.target network.target
AssertPathExists=/var/lib/navidrome

[Install]
WantedBy=multi-user.target

[Service]
User=<user>
Group=<group>
Type=simple
ExecStart=/opt/navidrome/navidrome --configfile "/var/lib/navidrome/navidrome.toml"
WorkingDirectory=/var/lib/navidrome
TimeoutStopSec=20
KillMode=process
Restart=on-failure

# See https://www.freedesktop.org/software/systemd/man/systemd.exec.html
DevicePolicy=closed
NoNewPrivileges=yes
PrivateTmp=yes
PrivateUsers=yes
ProtectControlGroups=yes
ProtectKernelModules=yes
ProtectKernelTunables=yes
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
RestrictNamespaces=yes
RestrictRealtime=yes
SystemCallFilter=~@clock @debug @module @mount @obsolete @privileged @reboot @setuid @swap
ReadWritePaths=/var/lib/navidrome

# You can uncomment the following line if you're not using the jukebox This
# will prevent navidrome from accessing any real (physical) devices
#PrivateDevices=yes

# You can change the following line to `strict` instead of `full` if you don't
# want navidrome to be able to write anything on your filesystem outside of
# /var/lib/navidrome.
ProtectSystem=full

# You can comment the following line if you don't have any media in /home/*.
# This will prevent navidrome from ever reading/writing anything there.
#ProtectHome=true
```

#### Start the Navidrome Service

Relaod the service daemon, start the newly create service, and verify it has started correctly.

```
sudo systemctl daemon-reload
sudo systemctl start navidrome.service
sudo systemctl status navidrome.service
```

If the service has started correctly verify you can access `http://localhost:4533`

#### Start Navidrome on Startup

```
sudo systemctl enable navidrome.service
```
