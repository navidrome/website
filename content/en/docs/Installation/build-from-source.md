---
title: "Build from sources"
linkTitle: "Build from sources"
date: 2016-01-05
description: >
  Can't find a build for your platform?
---

If you can't find a [pre-built binary](/docs/installation/pre-built-binaries) for your platform,
you should open an [issue in the project's GitHub page](https://github.com/deluan/navidrome/issues).

If you don't want to wait, you can try to generate the binary yourself, with the following steps.

First, you will need to install [Go 1.14](https://golang.org/doc/install) and
[Node 14](http://nodejs.org). The setup is very strict, and the steps below only work with
these versions (enforced in the Makefile). Make sure to add `$GOPATH/bin` to your `PATH` as described
in the [Go install instructions](https://golang.org/doc/install#install)

After the prerequisites above are installed, clone this repository and build Navidrome:

```shell script
$ git clone https://github.com/deluan/navidrome
$ cd navidrome
$ make setup        # Install build dependencies
$ make buildall     # Build UI and server, generates a single executable
```

This will generate the `navidrome` executable binary in the project's root folder.

**NOTE:** Remember to install [ffmpeg](https://ffmpeg.org/download.html) in your system, a requirement for Navidrome to work
properly. You may find the latest static build for your platform here: https://johnvansickle.com/ffmpeg/
