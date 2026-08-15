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
2. A [configuration file](https://www.navidrome.org/docs/usage/configuration/options) for Navidrome has been created and is named `navidrome.toml` in that folder. Be sure to set the `DataFolder` option as well.
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
        <key>KeepAlive</key>
        <true/>
        <key>WorkingDirectory</key>
        <string>/opt/navidrome</string>
        <key>StandardOutPath</key>
        <string>/opt/navidrome/navidrome.log</string>
        <key>StandardErrorPath</key>
        <string>/opt/navidrome/navidrome.log</string>
    </dict>
</plist>
```

## File ownership and permissions

A `LaunchAgent` runs as your own user, not as `root`. All files must therefore belong to
your user. If you created `/opt/navidrome` with `sudo`, the folder belongs to `root` and
Navidrome cannot write to it.

Set the owner and the permissions like this:

```bash
# Give the whole folder to your user
sudo chown -R "$(whoami):staff" /opt/navidrome

# Make the binary executable
chmod 755 /opt/navidrome/navidrome

# Restrict the config file, as it can contain secrets
chmod 600 /opt/navidrome/navidrome.toml

# Create the data folder and keep it private.
# Use the path that you set in the DataFolder option.
mkdir -p /opt/navidrome/data
chmod 700 /opt/navidrome/data

# Let Navidrome write the log
chmod 644 /opt/navidrome/navidrome.log

# launchd refuses a plist that other users can write
chmod 644 ~/Library/LaunchAgents/navidrome.plist
```

This table shows the required values:

| Path | Owner | Mode | Notes |
|------|-------|------|-------|
| `/opt/navidrome` | your user | `755` | Working directory |
| `/opt/navidrome/navidrome` | your user | `755` | Must be executable |
| `/opt/navidrome/navidrome.toml` | your user | `600` | Read only for you |
| `/opt/navidrome/data` | your user | `700` | `DataFolder`, see the warning below |
| `/opt/navidrome/navidrome.log` | your user | `644` | Must be writable |
| `~/Library/LaunchAgents/navidrome.plist` | your user | `644` | `launchd` rejects mode `666` |
| Your music folder | any | — | Read access is sufficient |

{{% alert title="Keep the data folder private" color="warning" %}}
The `DataFolder` option sets where the data folder is. If you did not use
`/opt/navidrome/data`, apply the commands above to your own path.

Navidrome makes this folder on the first start if it does not exist. It makes the folder and
the database file readable for all users. The database holds the accounts and the passwords of
your users. Thus, on a Mac with more than one account, a different user can read them.

Set the mode of the data folder to `700` to prevent this. Navidrome operates correctly with
this mode. If Navidrome already made the folder, set the mode again after the first start.
{{% /alert %}}

## Access to protected folders

Correct file permissions are not always sufficient. macOS has a second, independent privacy
system. It blocks some folders even when the file permissions permit access. A service started
by `launchd` gets no permissions from your terminal, so this problem is common.

These folders are blocked:

- `~/Desktop`, `~/Documents` and `~/Downloads`
- `~/Music/Music`, the Apple Music library folder
- All external and network volumes in `/Volumes`

These folders are not blocked:

- `~/Music` itself, but not the `Music` subfolder in it
- `/Users/Shared`
- `/opt` and other folders outside your home folder

**The simplest solution is to keep your music in a folder that macOS does not block**, for
example `/Users/Shared/Music`. Then you do not need any of the steps below.

### Symptoms

When macOS blocks your music folder, Navidrome does not report a clear error. Look for these
signs instead:

- The library is empty after a scan, and no track is found.
- The log contains this line, which gives the wrong reason:

  ```
  level=warning msg="Scanner: Target folder does not exist." error="open .: operation not permitted"
  ```

  The folder does exist. The permission is the real cause.

There is a third symptom that is easy to miss. The first time Navidrome reads a blocked folder,
macOS shows a permission dialog, and Navidrome **waits** for your answer. If you do not see the
dialog, the scan seems to freeze, and the log shows:

```
level=error msg="Scan failed" error="library count: context canceled"
```

### How to give access

Two methods are possible. Both work.

1. **Answer the dialog.** Click **Allow** when the dialog appears. macOS then adds an entry
   under **System Settings** > **Privacy & Security** > **Files & Folders**. You can switch it
   on and off there later.
2. **Give Full Disk Access.** Use this method if you did not see the dialog, or if you closed
   it:
   - Open **System Settings** > **Privacy & Security** > **Full Disk Access**.
   - Click **+**, then press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> and enter
     `/opt/navidrome`.
   - Select the `navidrome` binary and set the switch to on.
   - Restart the service.

{{% alert title="You must do this again after each update" color="warning" %}}
macOS attaches the permission to the binary itself, not to its path. When you install a new
version of Navidrome, the permission no longer applies.

After an update, Navidrome cannot read your music folder, and macOS shows the dialog again. If
nobody answers that dialog, the scan waits and then fails with `context canceled`.

Keep your music in a folder that macOS does not block to prevent this.
{{% /alert %}}

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
