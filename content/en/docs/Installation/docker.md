---
title: "Using Docker?"
linkTitle: "Using Docker"
date: 2017-01-05
description: >
  No problem! Actually even better ;)
---


[Docker images](https://hub.docker.com/r/deluan/navidrome) are available for _linux/amd64_ platform. 
They include everything needed to run Navidrome. Example of usage with Docker Compose:

```yaml
# This is just an example. Customize it to your needs.

version: "3"
services:
  navidrome:
    image: deluan/navidrome:latest
    ports:
      - "4533:4533"
    environment:
      # All options with their default values:
      ND_MUSICFOLDER: /music
      ND_DATAFOLDER: /data
      ND_SCANINTERVAL: 1m
      ND_LOGLEVEL: info  
      ND_PORT: 4533
      ND_TRANSCODINGCACHESIZE: 100MB
      ND_SESSIONTIMEOUT: 30m
      ND_BASEURL: ""
    volumes:
      - "./data:/data"
      - "/path/to/your/music/folder:/music:ro"
```

Take a look here for more [configuration options](/docs/usage/configuration-options/)

To get the cutting-edge, latest development version, use the image `deluan/navidrome:develop`
