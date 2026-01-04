---
title: "Getting Started"
linkTitle: "Getting Started"
weight: 3
description: >
  Already installed? Play us a song, Navidrome!
---

After [installing](/docs/installation) Navidrome in your platform, you need to create your
first user. This will be your admin user, a super user that can manage all aspects of Navidrome,
including the ability to manage other users. Just browse to Navidrome's homepage at
[http://localhost:4533](http://localhost:4533) and you will be greeted with a screen like this:

<p align="center">
<img width="500" src="/screenshots/create-first-user.webp">
</p>

Just fill out the username and password you want to use, confirm the password and click on the
"Create Admin" button.

That's it! You should now be able to browse and listen to all your music.

**Note**: It usually take a couple of minutes for
your music to start appearing in Navidrome's UI. You can check the logs to see what is the scan
progress. If you see any errors, [reach out](/community) and we can help you

**Note**: If you have any `.m3u` playlist in your music folder, they should be added as playlist
in Navidrome automatically. However, Navidrome only does that when there is an admin user. On a
fresh installation, it can happen that Navidrome already finished scanning your music folder
before you created the first admin user. In that case, you need to make sure the "last modified"
date of the `m3u` files is newer than the last scan. On Linux and macOS systems, this can be
done with the `touch` command.

**Multi-Library Support**: If you need to organize multiple music collections (e.g., separating audiobooks from music,
or managing family libraries), check out the [Multi-Library documentation](/docs/usage/multi-library/) to learn how to
set up additional libraries with user-specific access controls.

**Externalized Authentication**: Navidrome supports delegating authentication to another system, which can be useful e.g. if you want to integrate it into your homelab setup. Check out the [Externalized Authentication Quick Start guide](./extauth-quickstart/) to learn the basics, or the [Externalized Authentication documentation](/docs/usage/externalized-authentication/) for a comprehensive overview of the functionality and hints for more advanced integration scenarios.
