---
title: "Development Environment"
linkTitle: "Development Environment"
weight: 1
description: >
  How to setup your local development environment
---

{{% pageinfo %}}
This is just a summary on how to get started. If you are stuck or have any questions, please join our [Discord server](https://discord.gg/xh7j7yF) and give us a shout on the `#dev` channel
{{% /pageinfo %}}

Any IDE with good support for GoLang and JavaScript/Node can be used for Navidrome development. We suggest using [Visual Studio Code](https://code.visualstudio.com/), which has excellent support for both languages.

### Using VSCode + Dev Container (Docker)

The project includes a [VSCode Dev Container](https://code.visualstudio.com/docs/remote/containers) configuration for using with [Docker](https://www.docker.com/products/docker-desktop). The Dev Container provides all dependencies out-of-the-box. If you prefer to install all dependencies yourself, or cannot/don't want to install Docker for any reason, see the other sections below for step by step instructions for your OS.

{{% alert title="Note" %}}
Keep in mind that the overall experience when using Docker Desktop for development will be slower than normal, because access to the host OS filesystem is generally slower. If you want to have full performance, we recommend installing the dependencies directly on your system and skip using Docker for development.
{{% /alert %}}

### Unix-based systems (Linux, macOS, BSD, …)

1. Install [GoLang 1.23+](https://golang.org/doc/install)
2. Install [Node 20](http://nodejs.org/)
3. Install [TagLib 2.0+](https://github.com/taglib/taglib/blob/master/INSTALL.md)
    - Arch Linux: `pacman -S taglib`
    - macOS: `brew install taglib --HEAD`
    - For other platforms check their [installation instructions](https://github.com/taglib/taglib/blob/master/INSTALL.md)

4. Install `pkg-config`
5. Clone the project from https://github.com/navidrome/navidrome
6. Install development tools: `make setup`. This may take a while to complete
7. Test installation: `make build`. This command should create a `navidrome` executable in the project's folder
8. Create a `navidrome.toml` config file in the project's folder with ([at least](/docs/usage/configuration-options/#available-options)) the following options:
```toml
# Set your music folder, preferable a specific development music library with few songs,
# to make scan fast
MusicFolder = "/path/to/music/folder"

# Make logging more verbose
LogLevel = "debug"

# This option will always create an `admin` user with the specified password, so you don't
# have to create a user every time you delete your dev database
DevAutoCreateAdminPassword = "password"

# Move the data/DB folder out of the root. `./data` folder is ignored by git
DataFolder = "./data"

# If you are developing in macOS with its firewall enabled, uncomment the next line to avoid 
# having to accept incoming network connections every time the server restarts:
# Address = "localhost"
```
To start Navidrome in development mode, just run `make dev`. This will start both the backend
and the frontend in "watch" mode, so any changes will automatically be reloaded. It will open
Navidrome automatically in your browser, using the URL http://localhost:4533/

If it does not open a new window in your browser, check the output for any error messages.

For more useful `make` targets, run `make help`.

### Building it locally

To build Navidrome locally, follow these steps:

1. Make sure you have all the dependencies installed as mentioned in the previous sections.
2. Open a terminal and navigate to the project's folder.
3. Run the command `make build` to build the whole project. This will create a `navidrome` binary in the project's folder

### Building with Docker

{{% alert %}}
To build Navidrome with Docker, you need to have Docker installed on your system. If you don't have it, you can 
download it from [Docker's website](https://www.docker.com/products/docker-desktop).
{{% /alert %}}

If you want to build Navidrome for a different platform than your own dev environment, use `make docker-build` and specify the OS/Platform as parameters. Example for Linux/ARM:
```shell
make docker-build PLATFORMS=linux/amd64,windows/amd64
```

To get a list of all available platforms, run `make docker-platforms`.

If you want to build a Docker image with your local changes, use `make docker-image`. 
The built image will be tagged locally as `deluan/navidrome:develop`. This can be overridden by setting the `DOCKER_TAG` variable.
Use `IMAGE_PLATFORMS` to specify the platforms you want to build the image for. Example:

```shell
make docker-image IMAGE_PLATFORMS=linux/amd64,windows/amd64 DOCKER_TAG=mytag
```

### Windows (using WSL)

Even though it is possible to setup a fully working Navidrome development environment in Windows, we currently don't provide instructions for that (feel free to contribute to these docs if you successfully set it up). 

The (arguably better) alternative is to set up the project using [Visual Studio Code](https://code.visualstudio.com/) and [WSL](https://docs.microsoft.com/en-us/windows/wsl/), which effectively lets you develop in a Linux environment while still using your Windows system.

#### Installing WSL
  1. Make sure your Windows 10 is updated.
  2. Go to _Settings > Turn Windows feature on or off > Windows subsystem for Linux_.
  3. Go to Microsoft Store and download and install any Linux distro you like. For maximum compatibility, we recommend Ubuntu.
  4. Open Downloaded Linux distro, add username and password and then update it using: `sudo apt update && sudo apt upgrade -y`.
  5. Install needed compilers for building Navidrome: `sudo apt install gcc g++`
  6. This will create an Linux terminal where you can execute any Linux commands.

Make sure you are using WSL 2.0

#### Configuring Visual Studio Code
  1. Click on Extensions (present on leftmost column), install _Remote Development_ extension and reload VSCode.
  2. Press <kbd>F1</kbd>, execute _Remote-WSL: New Window_. This will connect your installed Linux distro to VSCode.
  3. Now you can open a VSCode terminal and you'll be able to run any Linux command.

#### Common Issues
  1. Because of [this WSL issue](https://github.com/microsoft/WSL/issues/4885) you need to use your network IP address to be able to login to Navidrome in development mode. Otherwise you will get an `Error: Unauthorized` when logging in. You can see your network IP address after running `make dev`. 

Now that you have a working instance of Linux running on your machine, follow the steps above for [Unix-based system](/docs/developers/dev-environment/#unix-based-systems-linux-macos-bsd-) in the VSCode terminal. For more information on working with VSCode+WSL, check their [documentation](https://code.visualstudio.com/docs/remote/wsl).

## Troubleshooting

### System limit for number of file watchers reached


If you encounter the `Error: ENOSPC: System limit for number of file watchers reached, watch` while running `make dev` on Linux systems, then your system is maxing out the number of files that can be "watched" for changes at one time.

To increase this limit, you can run the command `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`, which adds the line `fs.inotify.max_user_watches=524288` to `/etc/sysctl.conf` and reloads sysctl so the change takes effect. this allows `inotify` to watch more files and folders for changes at a time.

More information about this can be found [here](https://dev.to/rubiin/ubuntu-increase-inotify-watcher-file-watch-limit-kf4)
