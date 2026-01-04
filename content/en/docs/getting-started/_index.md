---
title: "Getting Started"
linkTitle: "Getting Started"
weight: 3
description: >
  Already installed? Play us a song, Navidrome!
---

This guide walks you through your first session with Navidrome, from verifying your installation to playing your first song.

## Before You Begin

Make sure you've completed the [installation](/docs/installation) for your platform. Verify these items before proceeding:

{{% alert title="Pre-flight Checklist" color="primary" %}}
- ☑️ Navidrome is installed and the service/process is running
- ☑️ Your music folder path is configured correctly
- ☑️ The Navidrome process has read access to your music folder
- ☑️ Port 4533 (or your custom port) is accessible
{{% /alert %}}

## Step 1: Verify Navidrome is Running

Before creating your admin user, confirm Navidrome started successfully.

**Check the logs for a successful startup message:**

{{< tabpane text=true >}}
{{% tab header="Docker" %}}
```bash
docker logs navidrome
```
{{% /tab %}}
{{% tab header="Linux (systemd)" %}}
```bash
sudo journalctl -u navidrome -f
```
{{% /tab %}}
{{% tab header="Windows" %}}
Check the log file in your Navidrome installation folder, or use Event Viewer for service logs.
{{% /tab %}}
{{% tab header="macOS" %}}
```bash
cat /opt/navidrome/navidrome.log
```
Or check the path you specified in your LaunchAgent plist.
{{% /tab %}}
{{< /tabpane >}}

**What success looks like:** You should see log entries showing Navidrome starting up and beginning to scan your music folder. Look for messages like:
```
Creating DB Schema
Scanner: Starting scan
Navidrome server is ready!
```

If you see errors about missing folders or permission denied, see [Troubleshooting](#troubleshooting) below.

## Step 2: Create Your Admin User

Open your browser and navigate to [http://localhost:4533](http://localhost:4533) (or your custom address/port).

You should see the admin user creation screen:

<p align="center">
<img width="500" src="/screenshots/create-first-user.webp">
</p>

Fill in your desired username and password, confirm the password, and click **"Create Admin"**.

**What success looks like:** After clicking the button, you'll be logged in and see the Navidrome interface. The sidebar will show menu items like "Albums", "Artists", "Playlists", etc.

## Step 3: Wait for Your Music to Appear

Navidrome scans your music folder in the background. **This takes time** — the duration depends on your library size:

| Library Size | Approximate Scan Time |
|-------------|----------------------|
| < 1,000 songs | Under 1 minute |
| 1,000 - 10,000 songs | 1-5 minutes |
| 10,000 - 50,000 songs | 5-15 minutes |
| 50,000+ songs | 15+ minutes |

**What success looks like:** Albums and artists will gradually appear in the interface. You can monitor progress in the logs — look for messages showing files being processed.

{{% alert title="Tip" color="info" %}}
You can start browsing and playing music as soon as any content appears — you don't need to wait for the full scan to complete.
{{% /alert %}}

## Step 4: Play Your First Song

Once some music appears:

1. Click on **"Albums"** in the sidebar
2. Click on any album cover
3. Click the play button on any track

**Congratulations!** You're now streaming your own music with Navidrome. 🎉

---

## Troubleshooting

### Music Not Appearing

**Check scan progress in the logs.** If you see ongoing scan activity, just wait — large libraries take time.

**Verify your music folder path:**
- Ensure the path in your configuration matches where your music files actually are
- Check that paths are case-sensitive on Linux/macOS
- For Docker: verify your volume mount is correct (e.g., `-v /path/to/music:/music:ro`)

**Check file formats.** Navidrome supports MP3, FLAC, AAC, OGG, OPUS, WMA, APE, WavPack, and more. Files must have proper audio metadata (tags) to appear correctly.

### Permission Problems

**The Navidrome process must have read access to your music folder.**

{{< tabpane text=true >}}
{{% tab header="Docker" %}}
Ensure the `user` directive matches the owner of your music folder:
```yaml
user: 1000:1000  # Should match: ls -n /path/to/music
```
{{% /tab %}}
{{% tab header="Linux" %}}
```bash
# Check current permissions
ls -la /path/to/music

# If needed, ensure the navidrome user can read:
sudo chmod -R o+rX /path/to/music
# Or add the navidrome user to the appropriate group
```
{{% /tab %}}
{{% tab header="Windows" %}}
Right-click your music folder → Properties → Security tab. Ensure the service account has Read permissions.
{{% /tab %}}
{{% tab header="macOS" %}}
```bash
# Check permissions
ls -la /path/to/music

# Grant read access if needed
chmod -R o+rX /path/to/music
```
If using Full Disk Access, ensure Terminal or the Navidrome process has the permission in System Settings → Privacy & Security.
{{% /tab %}}
{{< /tabpane >}}

### Cannot Access Navidrome in Browser

1. **Verify the service is running** (see Step 1 above)
2. **Check you're using the correct URL:**
   - Default: `http://localhost:4533`
   - If accessing remotely, use your server's IP address
   - If you configured a custom port, use that instead
3. **Check firewall settings** — port 4533 (or your custom port) must be open
4. **For Docker:** ensure the port mapping is correct (`-p 4533:4533`)

### Playlists Not Importing

Navidrome imports `.m3u` playlists from your music folder, but only after an admin user exists. If playlists aren't appearing:

1. Make sure you've created the admin user first
2. Update the playlist file timestamps to trigger reimport:
   ```bash
   touch /path/to/music/*.m3u
   ```
3. Wait for the next scan cycle, or trigger a manual scan from the UI

---

## Platform-Specific Tips

{{< tabpane text=true >}}
{{% tab header="Docker" %}}
- **User permissions:** The `user: 1000:1000` in docker-compose should match your music folder owner. Check with `ls -n /path/to/music`
- **Volume paths:** Use absolute paths, not relative ones
- **Logs:** Use `docker logs -f navidrome` to follow logs in real-time
- **Restart:** `docker-compose restart navidrome` to apply config changes
{{% /tab %}}
{{% tab header="Linux" %}}
- **Service management:** Use `systemctl status navidrome` to check service health
- **SELinux/AppArmor:** These may block access to music folders. Check with `ausearch -m avc` or system logs
- **Socket permissions:** If using Unix sockets for reverse proxy, ensure correct permissions
{{% /tab %}}
{{% tab header="Windows" %}}
- **Service account:** The service runs as Local System by default. Change to your user account if you need access to network drives
- **Path format:** Use Windows paths in navidrome.toml (e.g., `MusicFolder = "C:\\Music"`)
- **Firewall:** Windows Defender may block the port — add an exception if needed
{{% /tab %}}
{{% tab header="macOS" %}}
- **Quarantine errors:** If you see "navidrome is damaged", run: `sudo xattr -d com.apple.quarantine /path/to/navidrome`
- **Full Disk Access:** May be required for some music folder locations
- **LaunchAgent logs:** Check the paths in your plist file match reality
{{% /tab %}}
{{< /tabpane >}}

---

## Next Steps

Now that Navidrome is running, explore these features:

- **[Multi-Library Support](/docs/usage/features/multi-library/):** Organize multiple music collections (audiobooks, family libraries) with separate access controls
- **[External Authentication](/docs/usage/configuration/authentication/):** Integrate with your homelab SSO or external auth system
- **[Configuration Options](/docs/usage/configuration/options/):** Customize scanning, transcoding, and more
- **[Client Apps](/docs/overview/apps/):** Connect mobile apps, desktop players, and more

---

Still having trouble? Check the [full documentation](/docs/) or [reach out to the community](/community) for help.
