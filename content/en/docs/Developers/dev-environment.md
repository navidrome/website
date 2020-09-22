---
title: "Development Environment"
linkTitle: "Development Environment"
weight: 1
description: >
  How to setup your local development environment
---

{{% pageinfo %}}
Currently these instructions only work for Unix-based systems (Linux, macOS, BSD, ...). 
This is just a summary on how to get started. More information will soon be available. 
If you are stuck or have any questions, please join our [Discord server](https://discord.gg/xh7j7yF) and 
give us a shout on the `#dev` channel
{{% /pageinfo %}}

### Docs Contributions
If you're interested in contributing to this website, head over to [navidrome/website](https://github.com/navidrome/website) on GitHub!

### Getting started

1. Install [GoLang 1.14](https://golang.org/doc/install). Make sure to add `$GOPATH/bin` to your `PATH`
2. Install [Node 14](http://nodejs.org/)
3. Install [TagLib](http://taglib.org)
    - Ubuntu: `sudo apt install libtag1-dev`
    - macOS: `brew install taglib`

4. Clone the project from https://github.com/deluan/navidrome
5. Install development tools: `make setup-dev`
6. Test installation: `make buildall`. This command should create a `navidrome` executable in the project's folder
7. Create a `navidrome.toml` config file in the project's folder with the following options:
```toml
# Set your music folder, preferable a specific development music library with few songs,
# to make scan fast
MusicFolder = "/path/to/music/folder"

# Make logging more verbose
LogLevel = "debug"

# This will always create an `admin` user with the specified password, so you don't have to 
# create a user every time you delete your dev database
DevAutoCreateAdminPassword = "password"

# Move the data/DB folder to a different location
DataFolder = "./data"

# If developing in macOS with the firewall enabled, this avoids having to accept incoming 
# network connections every time the server restarts
Address = "localhost"
```
To start Navidrome in development mode, just run `make dev`. This will start both the backend
and the frontend in "watch" mode, so any changes will automatically be reloaded.

If you get errors on any of these steps, join [our chat](/community/) for support.
