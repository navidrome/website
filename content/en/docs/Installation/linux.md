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
wget https://github.com/navidrome/navidrome/releases/download/v0.XX.0/navidrome_0.XX.0_Linux_x86_64.tar.gz -O Navidrome.tar.gz
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

Create a new file under `/etc/systemd/system/` named `navidrome.service`.
An example service file is available [on GitHub](https://github.com/navidrome/navidrome/blob/master/contrib/navidrome.service).

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
