---
title: "Installing with Docker"
linkTitle: "Docker"
date: 2017-01-05
description: >
  Using the official docker images with Docker and Docker Compose
---


[Docker images](https://hub.docker.com/r/deluan/navidrome) are available for the 
_linux/amd64_, _linux/arm/v6_, _linux/arm/v7_ and _linux/arm64_ platforms. They include everything needed to 
run Navidrome.


### Using `docker-compose` :

Create a `docker-compose.yml` file with the following content (or add the `navidrome` service 
below to your existing file):
```yaml
version: "3"
services:
  navidrome:
    image: deluan/navidrome:latest
    user: 1000:1000 # should be owner of volumes
    ports:
      - "4533:4533"
    restart: unless-stopped
    environment:
      # Optional: put your config options customization here. Examples:
      ND_SCANSCHEDULE: 1h
      ND_LOGLEVEL: info  
      ND_SESSIONTIMEOUT: 24h
      ND_BASEURL: ""
    volumes:
      - "/path/to/data:/data"
      - "/path/to/your/music/folder:/music:ro"
```
Start it with `docker-compose up -d`. Note that the environment variables above are just an example and are not required. The 
values in the example are already the defaults


### Using `docker` command line tool:
```shell
$ docker run -d \
   --name navidrome \
   --restart=unless-stopped \
   --user $(id -u):$(id -g) \
   -v /path/to/music:/music \
   -v /path/to/data:/data \
   -p 4533:4533 \
   -e ND_LOGLEVEL=info \
   deluan/navidrome:latest
```


### Customization
- The `user` argument should ideally reflect the `UID:GID` of the owner of the music library to avoid permission issues. For testing purpose you could omit this directive, but as a rule of thumb you should not run a production container as `root`.
- Remember to change the `volumes` paths to point to your local paths. `/data` is where Navidrome 
will store its DB and cache, `/music` is where your music files are stored. 
- [Configuration options](/docs/usage/configuration-options/) can be customized with environment 
variables as needed. For `docker-compose` just add them to the `environment` section or the yml 
file. For `docker` cli use the `-e` parameter. Ex: `-e ND_SESSIONTIMEOUT=24h`.
- If you want to use a [configuration file](/docs/usage/configuration-options/#configuration-file) with Navidrome running in Docker, 
you can create a `navidrome.toml` config file in the `/data` folder and set the option `ND_CONFIGFILE=/data/navidrome.toml`.
