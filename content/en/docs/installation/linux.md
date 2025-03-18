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


{{% alert color="warning" title="Important note" %}}
The following steps have been tested on KGARNER7's MACHINE! WHICH IS: Ubuntu 18.04 and should work on all version 16.04 and above as well as other Debian based distros. Throughout these instructions the commands will have placeholders for the user (`<user>`) and group (`<group>`) you want to run Navidrome under and the music folder path (`<library_path>`). If you are using an existing media library ensure the user has permissions to the media library.
{{% /alert %}}

## Install Navidrome Using Pre-built Binary

To install Navidrome on a Linux system using a .deb file, you can follow a streamlined process that leverages the convenience of Debian package management. This method simplifies the installation by eliminating the need to manually download and extract binaries.

Before you begin, ensure that your system is up to date and that you have ffmpeg installed, as it is a requirement for Navidrome to function properly.

~~~bash
sudo apt update
sudo apt upgrade
~~~

### Download the .deb File

1. **Visit the Navidrome Releases Page**: Go to the [Navidrome releases page](https://github.com/navidrome/navidrome/releases) on GitHub to find the latest .deb package suitable for your system architecture (e.g., amd64 for 64-bit systems).

2. **Download the .deb File**: Use wget or your browser to download the .deb file. Replace navidrome_0.XX.X_amd64.deb with the actual file name from the releases page.

~~~bash
wget https://github.com/navidrome/navidrome/releases/download/v0.XX.X/navidrome_0.XX.X_amd64.deb
~~~

### Install and Configure

There are two ways to install the package, `apt` and `dpkg`. `apt` is the usual method because it will automatically determine dependancies and install them (ffmpeg).

Using `apt`:

~~~bash
sudo apt install ./navidrome_0.XX.X_linux_amd64.deb
~~~

Using `dpkg`:

Install the package and then resolve the dependancies:

~~~bash
sudo dpkg -i ./navidrome_0.XX.X_amd64.deb
sudo apt install -f
~~~

**Configuration File**: After installation, Navidrome MUST be configured to run. The default path for the configuration file is /etc/navidrome/navidrome.toml. Create and edit the file using nano directly.

~~~bash
sudo nano /etc/navidrome/navidrome.toml
~~~

Add/update the following line to specify your music library path:

~~~conf
MusicFolder = "/path/to/your/music/library"
~~~

If the MusicFolder is not set, that the default music path is `/opt/navidrome/music` and it will be running as user `navidrome`.

For additional configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

**Start the Navidrome Service**: Use systemctl to start the Navidrome service and set it to run on startup.

~~~bash
sudo systemctl enable --now navidrome
~~~

**Check Service Status**: Verify that Navidrome is running correctly.

~~~bash
sudo systemctl status navidrome
sudo journalctl -u navidrome -f
~~~

If everything is set up correctly, Navidrome will be accessible via web browser: http://localhost:4533.


## Migrate from manual installation to .deb Pre-built package

Migrating from a manually installed Navidrome instance to the new pre-built .deb package version can streamline updates and maintenance. This guide will walk you through the process of migrating your existing Navidrome setup on Linux to the .deb package version, specifically from the 0.54.1 release.

Before starting the migration, ensure you have:

* **Backup**: Always back up your current Navidrome configuration and music library. This includes the navidrome.toml configuration file and any other custom settings you may have.
* **System Update**: Make sure your system is up to date.

~~~bash
sudo apt update
sudo apt upgrade
~~~

### Remove Existing Program

First, stop the currently running Navidrome service to prevent any conflicts during the installation of the new package.

~~~bash
sudo systemctl stop navidrome.service
~~~

Navigate to the directory where your self-built Navidrome is located and remove the files. Be cautious not to delete your configuration or music library.

~~~bash
sudo rm -rf /opt/navidrome
~~~

### Installation

The machine is now clean and ready for installation. Follow the regular [Linux installation instructions](#install-navidrome-using-pre-built-binary) above. Just be sure to place the config file and database in appropriate locations (/etc/navidrome/navidrome.toml).


### Additional Considerations

* **Permissions**: Ensure that the user `navidrone` which is used by the program has the necessary permissions to access your music library.
* **Environment Variables**: If you had any custom environment variables set in your previous setup, make sure to configure them in the new setup as well.


## Manual installation on Linux

Navidrome can also be installed using a self-built binary. In order to do so, first ensure your system is up to date and install [ffmpeg](https://ffmpeg.org/download.html).

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
sudo chmod +x /opt/navidrome/navidrome
sudo chown -R <user>:<group> /opt/navidrome
```

### Create Configuration File

In the directory `/etc/navidrome` create a new file named `navidrome.toml` with the following settings.

```toml
MusicFolder = "<library_path>"
```

For additional configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

### Create a systemd Unit

Create a new file under `/etc/systemd/system/` named `navidrome.service` with the following data. Make sure you replace
`<user>` and `<group>` with the user and group you want to run Navidrome under. If you use the backup feature, you will also need to add the backup path to the systemd allow-list for Navidrome as shown in the [Backup usage documentation]().

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
ExecStart=/opt/navidrome/navidrome --configfile "/etc/navidrome/navidrome.toml"
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
