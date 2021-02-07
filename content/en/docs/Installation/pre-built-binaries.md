---
title: "Pre-built Binaries"
linkTitle: "Pre-built Binaries"
date: 2017-01-05
description: >
  Ready to use binaries for all major platforms
---

Just head to the [releases page](https://github.com/navidrome/navidrome/releases) and download the latest version for your
platform. There are builds available for Linux (Intel and ARM, 32 and 64 bits), Windows (Intel 32 and 64 bits) and macOS (Intel 64 bits).

For [Raspberry Pi](https://www.raspberrypi.org), use a suitable Linux ARM builds. Tested with 
[Raspbian](https://www.raspberrypi.org/downloads/raspbian).

Remember to install [ffmpeg](https://ffmpeg.org/download.html) in your system, a requirement for Navidrome to work 
properly. You may find the latest static build for your platform here: https://johnvansickle.com/ffmpeg/.

If you have any issues with these binaries, or need a binary for a different platform, please 
[open an issue](https://github.com/navidrome/navidrome/issues).

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

```bash
sudo apt update
sudo apt upgrade
sudo apt install vim ffmpeg
```

#### Create Directory Structure

Create a directory to store the Navidrome executable and a working directory with the proper permissions.

```bash
sudo install -d -o <user> -g <group> /opt/navidrome
sudo install -d -o <user> -g <group> /var/lib/navidrome
```

#### Get Navidrome

Download the latest release from the [releases page](https://github.com/navidrome/navidrome/releases), extract the contents to the executable directory, and set the permissions for the files. (Replace the URL below with the one from the releases page):

```bash
wget https://github.com/navidrome/navidrome/releases/download/v0.XX.0/navidrome_0.XX.0_Linux_x86_64.tar.gz -O Navidrome.tar.gz
sudo tar -xvzf Navidrome.tar.gz -C /opt/navidrome/
sudo chown -R <user>:<group> /opt/navidrome
```

#### Create Configuration File

In the working directory, `/var/lib/navidrome` create a new file named `navidrome.toml` with the following settings.

```toml
MusicFolder = "<library_path>"
```

For additional configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

#### Create a Systemd Unit

Create a new file under `/etc/systemd/system/` named `navidrome.service` with the following data.

```toml
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

# You can comment the following line if you don't have any media in /home/*.
# This will prevent navidrome from ever reading/writing anything there.
#ProtectHome=true
```

#### Start the Navidrome Service

Relaod the service daemon, start the newly create service, and verify it has started correctly.

```bash
sudo systemctl daemon-reload
sudo systemctl start navidrome.service
sudo systemctl status navidrome.service
```

If the service has started correctly verify you can access [http://localhost:4533](http://localhost:4533).

#### Start Navidrome on Startup

```bash
sudo systemctl enable navidrome.service
```
### Windows Installation

Since Navidrome needs to be run from the command line, it is suggested to use a service wrapper to make any executable into a service as it does not make sense to have a terminal window open whenever you want to use Navidrome.
The examples below are for [Shawl](https://github.com/mtkennerly/shawl), [NSSM](http://nssm.cc/) and [WinSW](https://github.com/winsw/winsw).

{{% alert title="Note" %}}The default account for new services is the `Local System` account, which has a different `PATH` environment variable than your user account.  
If you need to have access to your user account's `PATH` environment variables, the easiest way is to change the user account used by the service. To do so, open the Services management console (Win+R, then open `services.msc`), locate the Navidrome service, head to the `Log On` tab, and change it there.{{% /alert %}}

#### Using Shawl

Prebuilt binaries are available on the [releases page](https://github.com/mtkennerly/shawl/releases) of Shawl. It's portable, so you can simply download it and put it anywhere without going through an installer. Otherwise if you have Rust installed, you can run `cargo install shawl`.

Here's how you create the service with Shawl, then start it. Note that this has to be run from an administrator command prompt.

```bat
shawl add --name Navidrome -- "C:\Services\navidrome\navidrome.exe" -c "C:\Services\navidrome\navidrome.toml"
sc start Navidrome
```

{{% alert title="Note" %}}When using Shawl, you have to use absolute paths when specifying folders/files as arguments to the navidrome binary and in the configuration file (remember to escape the backslashes in the configuration file). Refer to the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options) for more information about the available options.{{% /alert %}}

#### Using NSSM

No installation is required for NSSM. Just grab the latest release from their [download page](https://nssm.cc/download) and install the Navidrome service from an administrator command prompt using NSSM:

```bat
nssm install Navidrome
```

This opens a window where you can set the properties of the service; most notably, the path to the executable, the user account on which to run the service, the output files (`stout` and `sterr`) and file rotation. More information about the configurable options can be found [here](http://nssm.cc/usage).

You can also bypass the GUI and install the service from the command line only. Below is an example:

```bat
nssm install Navidrome "C:\Services\navidrome\navidrome.exe"
nssm set Navidrome AppDirectory "C:\Services\navidrome\"
nssm set Navidrome DisplayName Navidrome
# The username and password of the user account under which the service will run.
nssm set Navidrome ObjectName "username" "password"
nssm set Navidrome AppStdout "C:\Services\navidrome\navidrome.log"
nssm set Navidrome AppStderr "C:\Services\navidrome\navidrome.log"
nssm set Navidrome AppRotateFiles 1
nssm set Navidrome AppRotateSeconds 86400
nssm set Navidrome AppRotateBytes 10240

# Start the service
sc start Navidrome
```

#### Using WinSW

To use WinSW, download the WinSW binary from their [download page](https://github.com/winsw/winsw/releases). WinSW also requires a configuration file (more details about the WinSW configuration file [here](https://github.com/winsw/winsw/blob/v3/docs/xml-config-file.md)) to be able to manage an application. 

A basic example (where both Navidrome and the WinSW configuration file are in the same directory) for Navidrome is down below:

```xml
<service>
  <id>Navidrome</id>
  <name>Navidrome</name>
  <description>Modern Music Server and Streamer compatible with Subsonic/Airsonic</description>
  <executable>C:\Services\navidrome\navidrome.exe</executable>
  <arguments>-c navidrome.toml</arguments>
  <log mode="roll-by-size"></log>
</service>
```

{{% alert title="Note" %}}When specifying files or folders in the WinSW configuration file, relative paths are resolved based on where the configuration file is located.{{% /alert %}}

Save this in a file named `navidrome.xml`. Then, run these commands from an administrator command prompt to install the service, start it and check its status:

```bat
winsw install navidrome.xml
winsw start navidrome.xml
winsw status navidrome.xml
```

Verify that the service has started as expected by navigating to [http://localhost:4533](http://localhost:4533), by checking the Services Management Console or by checking the log file that the service wrapper created.
