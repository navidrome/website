---
title: "Build from sources"
linkTitle: "Build from sources"
date: 2016-01-05
description: >
  Can't find a build for your platform? You can try to build it yourself
---

{{% pageinfo %}}
Currently these instructions only work for Unix-based systems (Linux, macOS, BSD, ...). If you are getting 
trouble trying to build Navidrome in a Windows system, please join our [Discord server](https://discord.gg/xh7j7yF) 
and ask for help, we will be glad to assist you
{{% /pageinfo %}}


If you can't find a [pre-built binary](https://github.com/navidrome/navidrome/releases) for your platform,
you should open an [issue in the project's GitHub page](https://github.com/navidrome/navidrome/issues).

If you don't want to wait, you can try to build the binary yourself, with the following steps.

First, you will need to install [Go 1.19+](https://golang.org/doc/install) and
[Node 16](http://nodejs.org). The setup is very strict, and the steps below only work with
these versions (enforced in the Makefile). Make sure to add `$GOPATH/bin` to your `PATH` as described
in the [official Go site](https://golang.org/doc/gopath_code.html#GOPATH)

You'll also need to install the [TagLib](http://taglib.org) library:
- Debian/Ubuntu: `sudo apt install libtag1-dev`
- Arch Linux: `pacman -S taglib`
- macOS: `brew install taglib`
- FreeBSD: `pkg install taglib`
- For other platforms check their [installation instructions](https://github.com/taglib/taglib/blob/master/INSTALL.md)

After the prerequisites above are installed, clone Navidrome's repository and build it:

```shell script
$ git clone https://github.com/navidrome/navidrome
$ cd navidrome
$ make setup        # Install build dependencies
$ make buildall     # Build UI and server, generates a single executable
```

On FreeBSD you have to use `gmake`:

```shell script
$ git clone https://github.com/navidrome/navidrome
$ cd navidrome
$ gmake setup        # Install build dependencies
$ gmake buildall     # Build UI and server, generates a single executable
```

This will generate the `navidrome` executable binary in the project's root folder.

**NOTE:** Remember to install [ffmpeg](https://ffmpeg.org/download.html) in your system, a requirement for Navidrome to work
properly. You may find the latest static build for your platform here: https://johnvansickle.com/ffmpeg/
