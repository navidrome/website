---
title: "Using Docker?"
linkTitle: "Using Docker"
date: 2017-01-05
description: >
  No problem! Actually even better ;)
---


[Docker images](https://hub.docker.com/r/deluan/navidrome) are available for the 
_linux/amd64_, _linux/arm/v7_ and _linux/arm64_ platforms. They include everything needed to 
run Navidrome.


### Using `docker-compose` :

Create a `docker-compose.yml` file with the following content (or add the `navidrome` service 
below to your existing file):
```yaml
version: "3"
services:
  navidrome:
    image: deluan/navidrome:latest
    ports:
      - "4533:4533"
    restart: unless-stopped
    environment:
      # All options with their default values:
      ND_SCANINTERVAL: 1m
      ND_LOGLEVEL: info  
      ND_SESSIONTIMEOUT: 30m
      ND_BASEURL: ""
    volumes:
      - "/path/to/data:/data"
      - "/path/to/your/music/folder:/music:ro"
```
Start it with `docker-compose up -d`


### Using `docker` command line tool:
```shell
$ docker run -d \
   --name navidrome \
   --restart=unless-stopped \
   -v /path/to/music:/music \
   -v /path/to/data:/data \
   -p 4533:4533 \ 
   deluan/navidrome:latest
```


### Customization
- Remeber to change the `volumes` paths to point to your local paths. `/data` is where Navidrome 
will store its DB and cache, `/music` is where your music files are stored. 
- [Configuration options](/docs/usage/configuration-options/) can be customized with environment 
variables as needed. For `docker-compose` just add them to the `environment` section or the yml 
file. For `docker` cli use the `-e` parameter. Ex: `-e ND_SESSIONTIMEOUT=24h`
