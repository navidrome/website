---
title: "FreeBSD Install"
linkTitle: "FreeBSD"
date: 2017-01-03
description: >
  Steps to install on FreeBSD (using ports or package)
---


The following steps have been tested on FreeBSD 12 and 13.  They should work on all versions 11.4 and above as well as other supported versions. All prerequisites will be automatically installed when using a package or if building from ports. Throughout these instructions the commands will have placeholders for the user (`<user>`) and group (`<group>`) you want to run Navidrome under and the music folder path (`<library_path>`). If you are using an existing media library ensure the user has permissions to the media library.

### Install Using Package

Use the package tool (pkg) to install Navidrome from a binary package.

```sh
pkg install navidrome
```

Follow any on screen instructions to complete your installation.

### Build & Install Using Ports

Instead of using a binary package you can build from source.  Before you start, make sure your local ports tree is up to date.  Refer to the [FreeBSD Handbook](https://docs.freebsd.org/en/books/handbook/ports/#ports-using) on the recommended way to fetch or update your ports tree.

Switch to the port directory for Navidrome and run `make install`.

```sh
cd /usr/ports/multimedia/navidrome
make install
```

The build process could take several minutes depending on the speed of your computer.  Follow any on screen instructions to complete your installation.

### Start the Navidrome Service

Start the service and verify it has started correctly.

```sh
service navidrome onestart
service navidrome onestatus
```

Navidrome is configured to listen on `127.0.0.1` on port `4533`.  The <library_path> is preset to `${PREFIX}/share/navidrome/music`
If the service has started correctly, verify you can access [http://localhost:4533](http://localhost:4533).

To run Navidrome at system startup, enable the service in `/etc/rc.conf`:

```sh
sysrc navidrome_enable="YES"
```
## Customizing your Installation

The defaults provided out of the box by the port and package are sufficient to get your started.  You can customize these settings if required by using a combonation of `/etc/rc.conf` and the Navidrome configuration file.

### Run as a Different User

Navidrome will run as the `www` user.  If you need to change it to something else use `/etc/rc.conf` to set a user and group.
You can easily adjust this using the `sysrc` tool:

```
sysrc navidrome_user="<user>"
sysrc navidrome_group="<group>"
```

### Configuration File Location

A default configuration file will be installed under `/usr/local/etc/navidrome` named `config.toml`.  This can be changed by setting a new path in `/etc/rc.conf`.
You can easily adjust this using the `sysrc` tool:

```sh
sysrc navidrome_config="/path/to/new/config_file.toml"
```

Make sure the user Navidrome is running as has permission to read the file.

For additional configuration options see the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options/).

### Data Folder

The data folder is located under `/var/db/navidrome`.  The prefered way to change this is by using `/etc/rc.conf`
You can easily adjust this using the `sysrc` tool:

```
sysrc navidrome_datafolder="/path/to/new/folder"
```

Make sure the user Navidrome is running as has permission to read and write to the folder contents.

