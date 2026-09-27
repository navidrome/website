---
title: "macOS Install"
linkTitle: "macOS"
date: 2017-01-04
description: >
  Steps to install on macOS
---

You can start Navidrome by double-clicking the binary, or by running it in a terminal. However,
it then stops when you close the terminal window, and it does not start again when the Mac restarts.

To run Navidrome in the background, install it as a service with the
[`navidrome service`](/docs/usage/admin/cli/service/) command. The service starts when the Mac
starts, even before anyone logs in, and macOS restarts it if it crashes.

## Get Navidrome

Create a folder for Navidrome, and make your user its owner:

```bash
sudo mkdir -p /opt/navidrome
sudo chown "$(whoami):staff" /opt/navidrome
```

Download the latest release from the [release page](https://github.com/navidrome/navidrome/releases/latest).
Use `darwin_arm64` for a Mac with Apple silicon, or `darwin_amd64` for a Mac with an Intel
processor. Then extract it:

```bash
tar -xzf navidrome_*_darwin_*.tar.gz -C /opt/navidrome
```

{{% alert title="macOS Quarantine Error" color="warning" %}}
If you download the binary with a browser, you may see an error message saying:

```
"navidrome" is damaged and can't be opened. You should move it to the Bin.
```

macOS Gatekeeper quarantines the `navidrome` binary, because it was downloaded from the
internet. To remove the quarantine flag, run:

```bash
xattr -d com.apple.quarantine /opt/navidrome/navidrome
```
{{% /alert %}}

## Create the configuration file

Create the data folder. Navidrome keeps its database and its log files there, so make it private:

```bash
mkdir -m 700 /opt/navidrome/data
```

Create the file `/opt/navidrome/navidrome.toml`, and set at least these two options:

```toml
MusicFolder = "/Users/Shared/Music"
DataFolder = "/opt/navidrome/data"
```

See [Access to protected folders](#access-to-protected-folders) before you choose the music
folder. See the [configuration options](/docs/usage/configuration/options/) for all other options.

The configuration file can contain passwords and API keys, so make it private too:

```bash
chmod 600 /opt/navidrome/navidrome.toml
```

## Install the service

Install the service and start it:

```bash
sudo /opt/navidrome/navidrome service install --user "$(whoami)" -c /opt/navidrome/navidrome.toml
sudo /opt/navidrome/navidrome service start
```

Then open [http://localhost:4533](http://localhost:4533) and create the first admin user.

The service is a system service. Its definition is in `/Library/LaunchDaemons/navidrome.plist`.

{{% alert title="Always use --user" color="warning" %}}
Without `--user`, Navidrome runs as `root`, and all the files that it creates belong to `root`.
{{% /alert %}}

## Manage the service

All the `service` commands need `sudo`:

| Task | Command |
|------|---------|
| Show whether it runs | `sudo /opt/navidrome/navidrome service status` |
| Stop | `sudo /opt/navidrome/navidrome service stop` |
| Start | `sudo /opt/navidrome/navidrome service start` |
| Remove the service | `sudo /opt/navidrome/navidrome service uninstall` |

Without `sudo`, `service status` shows `Stopped`, even when Navidrome runs.

To apply changes to the configuration file, stop the service and start it again.

`service uninstall` removes only the service. Your configuration file, data folder and music stay.

Navidrome writes its log to `/opt/navidrome/data/navidrome.err.log`. The file
`navidrome.out.log` next to it stays empty. To use a different file, create its folder, set the
`LogFile` option, then uninstall the service and install it again.

## Update Navidrome

Stop the service, extract the new release over the old binary, and start the service again:

```bash
sudo /opt/navidrome/navidrome service stop
tar -xzf navidrome_*_darwin_*.tar.gz -C /opt/navidrome
sudo /opt/navidrome/navidrome service start
```

If your music is in a protected folder, you must give access again after each update. See the
next section.

## Access to protected folders

Correct file permissions are not always sufficient. macOS has a second, independent privacy
system. It blocks some folders even when the file permissions permit access. The service gets no
permissions from your terminal, so this problem is common.

These are the most common blocked folders:

- `~/Desktop`, `~/Documents` and `~/Downloads`
- `~/Music/Music`, the Apple Music library folder
- External drives and network shares in `/Volumes`

These folders are not blocked:

- `~/Music` itself, but not the `Music` subfolder in it
- `/Users/Shared`
- `/opt`

**The simplest solution is to keep your music in a folder that macOS does not block**, for
example `/Users/Shared/Music`. Then you do not need any of the steps below.

### Symptoms

When macOS blocks your music folder, Navidrome does not report a clear error. The first time
Navidrome reads the folder, macOS shows a permission dialog, and the scan **waits** for your
answer. The web UI still works, but the library stays empty. If nobody is logged in, for example
after the Mac restarts, nobody can answer the dialog.

When access is refused, the log contains a line like this, which gives the wrong reason:

```
level=warning msg="Scanner: Target folder does not exist." error="open .: operation not permitted" path=.
```

The folder does exist. The permission is the real cause.

### How to give access

Two methods are possible:

1. **Answer the dialog.** Click **Allow** when the dialog appears. macOS then adds an entry
   under **System Settings** > **Privacy & Security** > **Files & Folders**. You can switch it
   on and off there later.
2. **Give Full Disk Access.** Use this method if you did not see the dialog, or if you closed
   it:
   - Open **System Settings** > **Privacy & Security** > **Full Disk Access**.
   - Click **+**, then press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> and enter
     `/opt/navidrome`.
   - Select the `navidrome` binary and set the switch to on.
   - Stop the service and start it again.

{{% alert title="You must do this again after each update" color="warning" %}}
macOS attaches the permission to this exact build of the binary, and to its path. When you
install a new version of Navidrome, or move the binary, the permission no longer applies.

Keep your music in a folder that macOS does not block to prevent this.
{{% /alert %}}
