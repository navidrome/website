---
title: "Installation"
linkTitle: "Installation"
weight: 2
description: >
  Learn how to install Navidrome on your specific platform
aliases:
  - /docs/installation/pre-built-binaries
---

### Download

{{% pageinfo %}}
If you are using Docker, you can skip download and just head to the [Docker setup page](docker)
{{% /pageinfo %}}


Visit our [releases page](https://github.com/navidrome/navidrome/releases) in GitHub and download the latest version for your
platform. There are builds available for Linux (Intel and ARM, 32 and 64 bits), Windows (Intel 32 and 64 bits) and macOS (Intel 64 bits).

For ARM-Based systems (ex: [Raspberry Pi](https://www.raspberrypi.org)), check which ARM build is the correct one for 
your platform using [this table](https://www.riscosopen.org/wiki/documentation/show/ARMv7%20compatibility%20primer#introduction).

Remember to install [`ffmpeg`](https://ffmpeg.org/download.html) in your system, a requirement for Navidrome to work 
properly. If your OS does not provide a package for `ffmpeg`, you may find the latest static build for your platform here: https://johnvansickle.com/ffmpeg/.

### Setup

After downloading the [Navidrome binary](#download), follow the appropriate setup instructions for your platform: