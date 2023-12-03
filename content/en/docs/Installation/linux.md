---
title: "Linux Install"
linkTitle: "Linux"
date: 2017-01-05
description: >
  Steps to install on Ubuntu Linux (and other Debian based distros)
aliases:
  - /docs/installation/ubuntu-linux
---

{{% pageinfo %}}
**NOTE:** These instructions were created for the Ubuntu distribution, and even though they contain specific Ubuntu/Debian instructions (ex: `apt`) the concepts are generic enough and can be applied on most Linux distributions, even on those not based on Debian (ex: CentOS and OpenSUSE)
{{% /pageinfo %}}


The following steps have been tested on Ubuntu 18.04 and should work on all version 16.04 and above as well as other Debian based distros. Throughout these instructions the commands will have placeholders for the user (`<user>`) and group (`<group>`) you want to run Navidrome under and the music folder path (`<library_path>`). If you are using an existing media library ensure the user has permissions to the media library.

### Update and Install Prerequisites

Ensure your system is up to date and install [ffmpeg](https://ffmpeg.org/download.html).

```bash
sudo apt update
sudo apt upgrade
sudo apt install vim ffmpeg
```

### Create Directory Structure

Create a directory to store the Navidrome executable and a working directory with the proper permissions.

```bash
sudo install -d -o <user> -g <group> /opt/navidrome
sudo install -d -o <user> -g <group> /var/lib/navidrome
```

### Get Navidrome

Download the latest release from the [releases page](https://github.com/navidrome/navidrome/releases), extract the contents to the executable directory, and set the permissions for the files. (Replace the URL below with the one from the releases page):

```bash
wget https://github.com/navidrome/navidrome/releases/download/v0.XX.X/navidrome_0.XX.X_linux_amd64.tar.gz -O Navidrome.tar.gz
sudo tar -xvzf Navidrome.tar.gz -C /opt/navidrome/
sudo chown -R <user>:<group> /opt/navidrome
```

### Create Configuration File

In the working directory, `/var/lib/navidrome` create a new file named `navidrome.toml` with the following settings.

```toml
MusicFolder = "<library_path>"
```

For additional configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

### Create a Systemd Unit

Create a new file under `/etc/systemd/system/` named `navidrome.service` with the following data. Make sure you replace
`<user>` and `<group>` with the user and group you want to run Navidrome under.

```systemd
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
SystemCallFilter=~@clock @debug @module @mount @obsolete @reboot @setuid @swap
ReadWritePaths=/var/lib/navidrome

# You can uncomment the following line if you're not using the jukebox This
# will prevent navidrome from accessing any real (physical) devices
#PrivateDevices=yes

# You can change the following line to `strict` instead of `full` if you don't
# want navidrome to be able to write anything on your filesystem outside of
# /var/lib/navidrome.
ProtectSystem=full

# You can uncomment the following line if you don't have any media in /home/*.
# This will prevent navidrome from ever reading/writing anything there.
#ProtectHome=true

# You can customize some Navidrome config options by setting environment variables here. Ex:
#Environment=ND_BASEURL="/navidrome"
```

### Start the Navidrome Service

Reload the service daemon, start the newly create service, and verify it has started correctly.

```bash
sudo systemctl daemon-reload
sudo systemctl start navidrome.service
sudo systemctl status navidrome.service
```

If the service has started correctly verify you can access [http://localhost:4533](http://localhost:4533).

### Start Navidrome on Startup

```bash
sudo systemctl enable navidrome.service
```
