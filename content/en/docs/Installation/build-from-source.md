---
title: "Build from sources"
linkTitle: "Build from sources"
date: 2016-01-05
description: >
  Can't find a build for your platform? 
---

If you can't find a [pre-built binary](/docs/installation/pre-built-binaries) for your platform, 
you should open an [issue in the project's GitHub page](https://github.com/deluan/navidrome/issues).

If you don't want to wait, you can try to benerate the binary yourself, with the following 
simple steps.

First, you will need to install [Go 1.14](https://golang.org/dl/) and 
[Node 13.12.0](http://nodejs.org). The setup is very strict, and the steps bellow only work with 
these specific versions (enforced in the Makefile) 

After the prerequisites above are installed, clone this repository and build the application with:

```shell script
$ git clone https://github.com/deluan/navidrome
$ cd navidrome
$ make setup        # Install tools required for Navidrome's development 
$ make buildall     # Build UI and server, generates a single executable
```

This will generate the `navidrome` executable binary in the project's root folder. 

**NOTE* You'll also need [ffmpeg](https://ffmpeg.org) installed in your system. 
