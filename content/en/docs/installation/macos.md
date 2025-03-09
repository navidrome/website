---
title: "macOS Install"
linkTitle: "macOS"
date: 2017-01-04
description: >
  Steps to install on macOS
---


Navidrome can be ran by simply double-clicking the binary that has been downloaded from the [release page](https://github.com/navidrome/navidrome/releases/latest) or by running it in the command line. However, that will keep a terminal window open while Navidrome is running.

To have Navidrome running in the background, we can run it as a service.
We define a service as shown below and save that in a file named `navidrome.plist` in the `~/Library/LaunchAgents/` folder.

The example shown assumes a few things:

1. The binary has been downloaded and extracted to the `/opt/navidrome` folder.
2. A [configuration file](https://www.navidrome.org/docs/usage/configuration-options) for Navidrome has been created and is named `navidrome.toml` in that folder. Be sure to set the `DataFolder` option as well.
3. A log file for Navidrome has been created and is named `navidrome.log` in that folder.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>Label</key>
        <string>navidrome</string>
        <key>ProgramArguments</key>
        <array>
            <string>/opt/navidrome/navidrome</string>
            <string>-c</string>
            <string>/opt/navidrome/navidrome.toml</string>
        </array>
        <key>RunAtLoad</key>
        <true/>
        <key>StandardOutPath</key>
        <string>/opt/navidrome/navidrome.log</string>
        <key>StandardErrorPath</key>
        <string>/opt/navidrome/navidrome.log</string>
    </dict>
</plist>
```

Then to load the service, run:
```bash
launchctl load ~/Library/LaunchAgents/navidrome.plist
```

To start the service, run:
```bash
launchctl start navidrome
```

You can verify that Navidrome has started by navigating to [http://localhost:4533](http://localhost:4533), by running `launchctl list | grep navidrome` or by checking the log file specified.

To stop the service, run:
```bash
launchctl stop navidrome
```
