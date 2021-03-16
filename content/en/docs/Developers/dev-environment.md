---
title: "Development Environment"
linkTitle: "Development Environment"
weight: 1
description: >
  How to setup your local development environment
---

{{% pageinfo %}}
# For Windows users only:
Project can be set up using [WSL](https://g.co/kgs/kcU41r) + [Visual Studio Code](https://g.co/kgs/tsCHLa)
- Installing WSL
  1. Make sure your Windows-10 is updated.
  2. Go to Settings > Turn Windows feature on or off > Windows subsystem for Linux.
  3. Go to Microsoft Store > download and install any Linux Distro you like e.g(Ubuntu, Kali-Linux).
  4. open Downloded Linux Distro, add username and password and then update the app using - `sudo apt update && sudo apt upgrade -y`.
  5. This will create an Linux terminal where you can excute any Linux commands.
  <br/>
- Visual Studio Code
  1. Click on Extensions (present on leftmost coloumn) > install -Remote Development - extension > Reload Vscode.
  2. View > Command Pallete or Ctrl + shift + p > Remote-WSL : new Window
  3. This will connect your installed linux distro to Vscode.
  4. And now you can excute all given below commands on Vscode terminal.
If you are stuck or have any questions, please join our [Discord server](https://discord.gg/xh7j7yF) and 
give us a shout on the `#dev` channel
{{% /pageinfo %}}

### Getting started

1. Install [GoLang 1.16](https://golang.org/doc/install). Make sure to add `$GOPATH/bin` to your `PATH`
2. Install [Node 14](http://nodejs.org/)
3. Install [TagLib](http://taglib.org)
    - Ubuntu: `sudo apt install libtag1-dev`
    - macOS: `brew install taglib`

4. Clone the project from https://github.com/navidrome/navidrome
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
