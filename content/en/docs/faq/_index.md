---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
menu:
  main:
    weight: 30
description: >
  Frequently Asked Questions
---

## ▶︎ Can you add a browsing by folder option/mode to Navidrome?

While it is technically possible to add a browsing by folder option, doing so would require significant changes to
Navidrome's internal structures across most of its components. We have decided to focus on features that align with
our vision of a music server that emphasizes tags. Implementing folder browsing would not only be a major undertaking,
but it could also make supporting all of Navidrome's current and future features more difficult and error-prone.

Here are a few situations where users might find folder browsing important, and how Navidrome addresses them:

1. Grouping music by classification (e.g., genre, mood, grouping): Navidrome already handle these tags,
   you can browse by genres in Subsonic clients, and it will have a dedicated Genre view in the future.
   There is support for the multivalued `grouping` tag, (with a dedicated view coming in a future release as well).
2. Separating different types of content (music vs. audiobooks, lossy vs. lossless): Navidrome now supports
   [multi-library setups](/docs/usage/multi-library/) where you can create separate libraries with user-specific access controls.
3. Having different releases for the same album: This will is already supported, and is configurable via the
   [Persistent IDs](/docs/usage/pids/) feature. You can group albums by `musicbrainz_albumid`, `discogs_release_id`,
   `folder`, or any other tag you want.
4. Users who don't have their library tagged: **We explicitly do not support this**, as it would make it very difficult
   to support all features Navidrome has and will have. We do not want to have code that "infers" that a folder with
   a bunch of MP3 files is an album, as this approach would make the code highly complex and error-prone.

If browsing by folder is an essential feature for you, there are [alternative music servers](https://github.com/basings/selfhosted-music-overview)
that offer this functionality. We encourage you to explore these options if folder browsing is a priority.

---

## ▶︎ I have an album with tracks by different artists, why is it broken up into lots of separate albums, each with their own artist?

Navidrome only organises music by tags, it will not automatically group a folder containing a bunch of songs with different artists into one album.

For a "Various Artists" compilation, the `Part Of Compilation` tag (`TCMP=1` for id3, `COMPILATION=1` for FLAC) must be set, for all tracks.

For a single-artist album with a different artist name for each track (for example "Alice feat. Bob" , "Alice feat. Carol"), the `Album Artist` tags must be the same ("Alice") for all tracks.

Also, take a look at the [Persistent IDs](/docs/usage/pids/) feature, which can help you group tracks that belong to
the same album, even if they have different artist. You can group tracks by `folder`, for example, by setting
the configuration option `PID.Album="folder"`. Check the [PID documentation](/docs/usage/pids/) for more information.

---

## ▶︎ How can I edit my music metadata (id3 tags)? How can I rename/move my files?

With Navidrome you can't. Navidrome does not write to your music folder or the files by design. It may have capabilities to change/add
cover art for artists, albums and playlists in the future, but even then it won't write these images to your Music Folder or
embed them in the files.

The main reason for this is **security**: With an internet-facing server like Navidrome, users would only be one exploit
away from all their music getting deleted.

There are many excellent "real" tag editors / music library managers out there to work with your music library.

Navidrome recommends: [beets](https://beets.io) (Linux, macOS, Windows) and [Musicbrainz Picard](https://picard.musicbrainz.org/) (Linux, macOS, Windows).

Others: [mp3tag](https://www.mp3tag.de/en/index.html) (Windows, macOS), [ExifTool](https://exiftool.org/) (Linux, macOS, Windows), [Yate](https://2manyrobots.com/yate/) (macOS), [Kid3](https://kid3.kde.org/) (Windows, macOS, Linux), [foobar2000](https://www.foobar2000.org) (Windows, macOS), [MusicBee](https://getmusicbee.com/) (Windows), [Media Monkey](https://www.mediamonkey.com) (Windows), Groove Music (Windows), Windows Media Player (Windows), Apple iTunes (Windows), Apple Music (macOS).

If you are new to organizing and tagging your library, take a look at this post about how to use Picard or beets with Navidrome: [Organizing music with Musicbrainz Picard](http://www.thedreaming.org/2020/11/22/musicbrainz-picard/)

Don't forget to take a look at our [Tagging Guidelines](/docs/usage/tagging-guidelines/) to ensure your music library
is correctly tagged.

---

## ▶︎ How can I upload music to Navidrome?

Navidrome does not include built-in upload functionality, and this is by design. As [explained](https://github.com/navidrome/navidrome/issues/770#issuecomment-776272032) by the project maintainer, upload functionality is not a good fit for Navidrome itself, which focuses on streaming and organizing existing music libraries.

However, there are several excellent solutions you can use alongside Navidrome to enable music uploads:

**Recommended Solutions:**

1. **FileBrowser** - A [web-based file manager](https://filebrowser.org/) that provides a clean interface for uploading files directly to your music directory. It's lightweight, secure, and integrates well with Navidrome setups.

2. **FTP/SFTP Server** - Set up an FTP or SFTP server pointing to your music directory. This allows uploads using any FTP client and provides secure file transfer.

3. **Network Shares** - Use SMB/CIFS (Windows), NFS (Linux), or AFP (macOS) to share your music directory on your local network for easy file copying.

4. **Docker Stacks** - If you're using Docker, consider using a complete music stack that includes FileBrowser alongside Navidrome, such as the [Docker Music Stack](https://github.com/geekedtv/Docker-Music-Stack) example.

**With Multi-Library Support:**

Since Navidrome now supports [multi-library setups](/docs/usage/multi-library/), you can create a dedicated "Upload" library that automatically scans and makes available any new files you add. This workflow allows you to:

- Set up a separate upload directory with its own library
- Use any of the upload solutions above to add files to this directory
- Have Navidrome automatically detect and catalog new uploads
- Move or organize files later using your preferred file management tools

This approach maintains Navidrome's security model while providing flexible upload capabilities through specialized tools designed for file management.

---

## ▶︎ Where are the logs?

To achieve maximum compatibility with a great number of platforms, Navidrome follows the [Twelve Factor App](https://12factor.net/) methodology
as much as possible. Specifically in the case of [logs](https://12factor.net/logs), Navidrome does not try to do any storage or routing of
any log files, it only outputs all information to `stdout`, making it easy for the proper logging tools in each platform to handle them.
Some examples bellow:

- **Linux**: if you installed Navidrome using the Systemd unit (as explained in the [install instructions](/docs/installation/ubuntu-linux/#create-a-systemd-unit)), you can see the logs using the [journalctl](https://manpages.debian.org/stretch/systemd/journalctl.1.en.html) tool: `journalctl -u navidrome.service`.

- **Docker**: you can use `docker logs` or `docker-compose logs` to retrieve/follow the logs.

- **FreeBSD** by default logs are writen to `/var/log/debug.log`

- **Windows**: depending on what you used to install Navidrome as a service, the logs will be in different locations by default:
  - if you used the **MSI installer**, logs are written to `C:\ProgramData\Navidrome\navidrome.log` by default (configurable via the `DataFolder` setting).
  - if you used [Shawl](https://github.com/mtkennerly/shawl), just check the `shawl_for_navidrome_*.log` files created in the same location as the Shawl executable.
  - if you used [NSSM](http://nssm.cc/), the location of the logs are specified by the `AppStdout` attribute.
  - if you used [WinSW](https://github.com/winsw/winsw), the log file is in the same directory as the WinSW configuration file for the Navidrome service.

---

## ▶︎ Why are my multi-valued tags (ARTISTS, ALBUMARTISTS, etc.) not working properly in AAC/M4A files?

If you have AAC/M4A files where multi-valued tags like `ARTISTS`, `ALBUMARTISTS`, or `COMPOSER` are not being read correctly by Navidrome (showing only one artist instead of multiple), this is likely due to how some tagging applications write these tags.

**The Problem**: Some tag editors (including MP3Tag) may create duplicate "atoms" (metadata containers) when writing multi-valued tags to AAC/M4A files, rather than storing multiple values within a single atom. TagLib (the library Navidrome uses to read metadata) ignores duplicate atoms by design and only reads the first occurrence, causing the additional values to be lost.

**The Workaround**: Re-save your files using MusicBrainz Picard:

1. Open the affected files in MusicBrainz Picard
2. Without making any changes to the tags, simply save the files again
3. Picard will consolidate the duplicate atoms into properly formatted multi-valued tags
4. Rescan your library in Navidrome

Check Picard's configuration to make sure it preserves all your existing tag data while fixing the underlying storage format issue.

**Prevention**: When tagging new AAC/M4A files, using MusicBrainz Picard consistently should avoid this issue. If you prefer other tag editors, test a few files to ensure multi-valued tags display correctly in Navidrome before batch-processing your entire library.

{{< alert color="info" title="Note" >}}
This issue is specific to AAC/M4A files. Other formats like FLAC, MP3, and Ogg Vorbis handle multi-valued tags differently and are not affected by this problem.
{{< /alert >}}

---

## ▶︎ Can I run Navidrome in the cloud without managing my own server?

Yes, there are several options for running Navidrome in the cloud:

**Managed Hosting**: [PikaPods](https://www.pikapods.com) offers an [officially supported, cloud-hosted solution](/docs/installation/managed/#pikapods) that supports the project through revenue sharing.

**Self-Managed Cloud**: You can also deploy Navidrome on various cloud platforms like AWS, Google Cloud, DigitalOcean, or Linode using their VPS offerings. This gives you full control but requires managing the server yourself.

**Docker-based Platforms**: Many cloud platforms support Docker deployments, making it easy to run Navidrome using the official Docker image.

Check our [installation documentation](/docs/installation/) for specific guides on different deployment methods.
