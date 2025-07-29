---
title: "macOS Install"
linkTitle: "macOS"
date: 2025-07-28
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
4. Navidrome is added to the Full Disk Access list under System Preferences -> Privacy and Security. This is required for Navidrome to access your music library.

Then to load the service, run:
```bash
sudo /opt/navidrome/navidrome svc install
```

To start the service, run:
```bash
sudo /opt/navidrome/navidrome svc start
```

You can verify that Navidrome has started by navigating to [http://localhost:4533](http://localhost:4533) or by checking the log file specified.

To stop the service, run:
```bash
sudo /opt/navidrome/navidrome svc stop
```

{{% alert title="macOS Quarantine Error" color="warning" %}}
If you download the binary directly from GitHub, you may see an error message saying:

```
"navidrome" is damaged and can't be opened. You should move it to the Bin.
```

This error occurs because macOS's Gatekeeper has quarantined the `navidrome` executable as it was downloaded from the internet. To fix this issue, open Terminal and run:

```bash
sudo xattr -d com.apple.quarantine /path/to/navidrome
```

Replace `/path/to/navidrome` with the actual path to your binary (e.g., `/opt/navidrome/navidrome`). This will remove the quarantine flag from the navidrome binary and allow it to run.
{{% /alert %}}
