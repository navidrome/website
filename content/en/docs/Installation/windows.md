---
title: "Windows Install"
linkTitle: "Windows"
date: 2017-01-05
description: >
  Steps to install on Windows
---

Since Navidrome needs to be run from the command line, it is suggested to use a service wrapper to make it into a service as it does not make sense to have a terminal window open whenever you want to use Navidrome.
The examples below are for [Shawl](https://github.com/mtkennerly/shawl), [NSSM](http://nssm.cc/) and [WinSW](https://github.com/winsw/winsw).

{{% alert title="Note" %}}The default account for new services is the `Local System` account, which has a different `PATH` environment variable than your user account.  
If you need to have access to your user account's `PATH` environment variables, the easiest way is to change the user account used by the service. To do so, open the Services management console (Win+R, then open `services.msc`), locate the Navidrome service, head to the `Log On` tab, and change it there.{{% /alert %}}

### Using Shawl

Prebuilt binaries are available on the [releases page](https://github.com/mtkennerly/shawl/releases) of Shawl. It's portable, so you can simply download it and put it anywhere without going through an installer. Otherwise if you have Rust installed, you can run `cargo install shawl`.

Here's how you create the service with Shawl, then start it. Note that this has to be run from an administrator command prompt.

```bat
shawl add --name Navidrome -- "C:\Services\navidrome\navidrome.exe" -c "C:\Services\navidrome\navidrome.toml"
sc start Navidrome
```

{{% alert title="Note" %}}When using Shawl, you have to use absolute paths when specifying folders/files as arguments to the navidrome binary and in the configuration file (remember to escape the backslashes in the configuration file). Refer to the [configuration options page](https://www.navidrome.org/docs/usage/configuration-options) for more information about the available options.{{% /alert %}}

### Using NSSM

No installation is required for NSSM. Just grab the latest release from their [download page](https://nssm.cc/download) and install the Navidrome service from an administrator command prompt using NSSM:

```bat
nssm install Navidrome
```

This opens a window where you can set the properties of the service; most notably, the path to the executable, the user account on which to run the service, the output files (`stout` and `sterr`) and file rotation. More information about the configurable options can be found [here](http://nssm.cc/usage).

You can also bypass the GUI and install the service from the command line only. Below is an example:

```bat
nssm install Navidrome "C:\Services\navidrome\navidrome.exe"
nssm set Navidrome AppDirectory "C:\Services\navidrome\"
nssm set Navidrome DisplayName Navidrome
# The username and password of the user account under which the service will run.
nssm set Navidrome ObjectName "username" "password"
nssm set Navidrome AppStdout "C:\Services\navidrome\navidrome.log"
nssm set Navidrome AppStderr "C:\Services\navidrome\navidrome.log"
nssm set Navidrome AppRotateFiles 1
nssm set Navidrome AppRotateSeconds 86400
nssm set Navidrome AppRotateBytes 10240

# Start the service
sc start Navidrome
```

### Using WinSW

To use WinSW, download the WinSW binary from their [download page](https://github.com/winsw/winsw/releases). WinSW also requires a configuration file (more details about the WinSW configuration file [here](https://github.com/winsw/winsw/blob/v3/docs/xml-config-file.md)) to be able to manage an application. 

A basic example (where both Navidrome and the WinSW configuration file are in the same directory) for Navidrome is down below:

```xml
<service>
  <id>Navidrome</id>
  <name>Navidrome</name>
  <description>Modern Music Server and Streamer compatible with Subsonic/Airsonic</description>
  <executable>C:\Services\navidrome\navidrome.exe</executable>
  <arguments>-c navidrome.toml</arguments>
  <log mode="roll-by-size"></log>
</service>
```

{{% alert title="Note" %}}When specifying files or folders in the WinSW configuration file, relative paths are resolved based on where the configuration file is located.{{% /alert %}}

Save this in a file named `navidrome.xml`. Then, run these commands from an administrator command prompt to install the service, start it and check its status:

```bat
winsw install navidrome.xml
winsw start navidrome.xml
winsw status navidrome.xml
```

Verify that the service has started as expected by navigating to [http://localhost:4533](http://localhost:4533), by checking the Services Management Console or by checking the log file that the service wrapper created.
