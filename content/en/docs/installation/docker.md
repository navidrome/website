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
services:
  navidrome:
    image: deluan/navidrome:latest
    user: 1000:1000 # must own the data folder and be able to read music folder(s). See Permissions below
    ports:
      - "4533:4533"
    restart: unless-stopped
    environment:
      # Optional: put your config options customization here. Examples:
      # ND_LOGLEVEL: debug
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

### Permissions

The configurations above are examples. The IDs in them will not always match your machine, so adjust
them before you start the container.

Navidrome needs:

- read **and write** access to `/data`, where it creates its database and cache
- read access to `/music`

Both must be granted to the `UID:GID` you put in the `user` directive. The two folders fail in different
ways, so the logs tell you which one is wrong.

#### The data folder is not writable

Navidrome cannot create its database, and the container stops at startup:

```
level=error msg="Error applying PRAGMA optimize" error="unable to open database file: no such file or directory"
panic: runtime error: invalid memory address or nil pointer dereference
```

Create the data folder and give it to the same user you run the container as:

```shell
mkdir -p /path/to/data
sudo chown -R 1000:1000 /path/to/data
```

#### The music folder is not readable

Navidrome starts and the web interface works, but your library stays empty. The logs show:

```
level=error msg="Error starting watcher" error="open /music: permission denied" lib=/music/...
level=warning msg="Scanner: Target folder does not exist." error="open .: permission denied" path=.
```

The folder does exist, despite what the second message says. The container user just cannot open it.
Give that user read and execute access, either by changing the owner:

```shell
sudo chown -R 1000:1000 /path/to/your/music/folder
```

or, if other programs also use the folder, by opening it for reading:

```shell
sudo chmod -R a+rX /path/to/your/music/folder
```

Use `id -u` and `id -g` to find the IDs of your own user, and `ls -n /path/to/your/music/folder` to see
which IDs own your music.

Two things people often try that do not work:

- **`PUID` and `PGID` have no effect.** Those variables are a [linuxserver.io](https://docs.linuxserver.io/general/understanding-puid-and-pgid/)
  convention. Navidrome's image ignores them. Use the `user` directive instead.
- **Removing the `user` directive is not a fix.** The container then runs as `root`, which can write
  anywhere, so the error goes away. **Do not do this in production.** Fix the folder ownership instead.

### Customization

- The `user` argument should reflect the `UID:GID` that owns the data folder and can read the music library. See [Permissions](#permissions) above.
- Remember to change the `volumes` paths to point to your local paths. `/data` is where Navidrome
  will store its DB and cache, `/music` is where your music files are stored. For [multi-library setups](/docs/usage/features/multi-library/), you may need to mount additional volumes for each library.
- [Configuration options](/docs/usage/configuration/options/) can be customized with environment
  variables as needed. For `docker-compose` just add them to the `environment` section or the yml
  file. For `docker` cli use the `-e` parameter. Ex: `-e ND_SESSIONTIMEOUT=24h`.
- If you want to use a [configuration file](/docs/usage/configuration/options/#configuration-file) with Navidrome running in Docker,
  you can create a `navidrome.toml` config file in the `/data` folder and set the option `ND_CONFIGFILE=/data/navidrome.toml`.
