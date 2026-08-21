---
title: "Installing with Podman"
linkTitle: "Podman"
date: 2017-01-05
description: >
  Using the official container images with Podman and Podman Quadlet
---

[Container images](https://hub.docker.com/r/deluan/navidrome) are available for the
_linux/amd64_, _linux/arm/v7_ and _linux/arm64_ platforms. They include everything needed to
run Navidrome.

### Using `Podman Quadlet` :

Podman is created to run as both rootful (root user), and rootless (non-root user) modes. 
Quadlet is a generator tool embeded directly into Podman that translate your *.container files into systemd service. So you can enable/disable it to auto load at each session, like normal systemd service.

Put `navidrome.container` in `/etc/containers/systemd/` for root user, OR `$HOME/.config/containers/systemd/` for running as normal non-root user. Create a `navidrome.container` file with the following content:

```ini
[Unit]
Description=Quadlet-Navidrome

[Container]
Environment=ND_DEFAULTDOWNSAMPLINGFORMAT=opus ND_AGENTS=lastfm
Image=deluan/navidrome:latest
Pull=always
UserNS=keep-id
PublishPort=4533:4533 #1st number is published port, can be change or set yourself
Volume=/path/to/data:/data:z
Volume=/path/to/your/music/folder:/music:ro,z

[Service]
Restart=on-failure
TimeoutStartSec=30
```

Quadlets strictly require systemd to run. After creating `navidrome.container`, starting container as normal systemd service
Root user: `# systemctl start navidrome.container --now`

Non-root user: `systemctl --user start navidrome --now`

Checking if container could be loaded or not: `podman ps` . It should shown you in NAME `systemd-navidrome`

### Using `podman` command line tool:

You can run this command once to check if container image could be loaded normally or not at 1st
```shell
$ podman run --rm -d \
        --name systemd-navidrome \
        --replace \
        --userns=keep-id \
        -p 4533:4533 \
        -v /path/to/data:/data:z \
        -v /path/to/your/music/folder:/music:ro,z \
        --env ND_DEFAULTDOWNSAMPLINGFORMAT=opus \
        --env ND_AGENTS=lastfm \
        deluan/navidrome:latest
```

### Customization

- `Environment` var in Podman Quadlet can be set multiple vars in one line, separate by whitespace. But `--env` in podman must be set one by one.
- Remember to change the `volumes` paths to point to your local paths. `/data` is where Navidrome
  will store its DB and cache, `/music` is where your music files are stored. For [multi-library setups](/docs/usage/features/multi-library/), you may need to mount additional volumes for each library.
- [Configuration options](/docs/usage/configuration/options/) can be customized with environment
  variables as needed. For `docker-compose` just add them to the `environment` section or the yml
  file. For `docker` cli use the `-e` parameter. Ex: `-e ND_SESSIONTIMEOUT=24h`.
- If you want to use a [configuration file](/docs/usage/configuration/options/#configuration-file) with Navidrome running in Podman,
  you can create a `navidrome.toml` config file in the `/data` folder and set single option `ND_CONFIGFILE=/data/navidrome.toml` in environment var.
