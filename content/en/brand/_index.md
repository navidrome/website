---
title: Navidrome Name and Logo Guidelines
linkTitle: Brand
description: How apps, projects and the community can use the Navidrome name and logo.
layout: docs
---

{{< blocks/cover title="Name and Logo Guidelines" image_anchor="bottom" height="min" >}}

<p class="lead mt-5">
  Rules for app developers, packagers, writers and anyone else who wants to mention Navidrome
  or show its logo.
</p>

{{< /blocks/cover >}}

{{% blocks/section color="white" %}}

<div class="col-12">

We want people to build apps for Navidrome, write about Navidrome or the apps they build, and show off their work. 

We also want to ensure that **users know which apps come from the official Navidrome project and which come from other projects**. This is what the guidelines below are for.

If your use of the Navidrome name and brand follows the below guidelines, **you do not need to ask us for permission**: this page is your permission. If an
app store reviewer asks for evidence, send them a link to this page: `https://navidrome.org/brand/`

## The short version

**You are free, without asking for permission, to:**

- Say that your app or project works with Navidrome (eg. "for Navidrome", "Navidrome-compatible", "for Navidrome users").
- Add the name "Navidrome" to your app's store name, after your own app name (eg. "MyAmazingApp - Navidrome & Jellyfin", "TheBestClient for Navidrome").
- Show the Navidrome logo inside your app as part of a flow or screen that lets users manage a connection to a Navidrome server.
- Use the Navidrome name and logo in your app's store description, website, or marketing material to explain your app's functionality and capabilities.
- Use the Navidrome name and logo in articles, videos, tutorials, talks, and dashboards about Navidrome.
- Package and distribute the unmodified Navidrome software under its own name.

**You are not allowed, without explicit, written permission from us, to:**

- Call your app "Navidrome", or start your app's name with "Navidrome" (eg. "Navidrome For Music Lovers")
- Say, imply, or suggest that your app is the official Navidrome app, or that the official Navidrome project made, endorses or sponsors your app.
- Use the Navidrome logo as your app icon, or as part of it.
- Change the logo, or make a new logo that looks like it.
- Sell merchandise with the Navidrome name or logo.

## Using the name

Write it as **Navidrome**: one word, capital N. Not "NaviDrome" or "Navi-drome".

**Describing compatibility.** Any accurate statement is allowed. For example:

- "A music player for Navidrome"
- "Works with Navidrome and other Subsonic servers"
- "Navidrome-compatible"

Keep it true. If your app only supports the Subsonic API, do not suggest that your app supports Navidrome-only features.

**App and project names.** Your app needs its own name. You can add "Navidrome" at the of the name to tell people what it works with.

Here are som examples of allowed and prohibited use (this is a non-exhaustive list to help guide you):

| Allowed use | Prohibited use |
|----|--------|
| MyAmazingApp - Navidrome & Jellyfin | Navidrome |
| Foobar for Navidrome | Navidrome Mobile |
| Foobar: a Navidrome client | Navidrome Player by Foobar |
| TheBestClient for Navidrome | Navidrome Foobar |
| | Navidromer
| | Navydrome

Names that share part of the word, like "Navi-something", are allowed as long as they don't read as "Navidrome". Many apps in our [catalog](/apps/) already have names that follow this pattern (eg. "NaviBeat for Linux", "NaviBeat").

**Domains and social accounts.** Do not register domains, app store accounts, or social media
handles that look like they belong to the official Navidrome project, like `navidrome-app.com` or `@navidrome_music`. You can use `navidrome.yourdomain.com` for your own server.

## Using the logo

Here is the official Navidrome logo:

<div class="d-flex flex-wrap align-items-center gap-4 my-4">
  <img src="/brand/navidrome-logo.svg" alt="Navidrome logo" width="96" height="96">
  <div>
    <a href="/brand/navidrome-logo.svg" download>Download SVG</a><br>
    <a href="/brand/navidrome-logo.png" download>Download PNG (1024 x 1024)</a>
  </div>
</div>

**Inside your app.** You can show the logo where it stands for Navidrome itself. For example:

- A server type picker on a login or connection screen.
- A list of supported servers or integrations.
- A badge on a server entry, so users can tell a Navidrome server from other types of server.

The logo should be the same size or smaller than the other server logos around it. It must not be
the main image of your app or of a screen.

**Your app icon and store listing.** Do not use the Navidrome logo as your app icon, in your icon, or as the main image of your store listing. Store screenshots can show the logo if it appears in your app
as described above.

**Articles, videos and dashboards.** Use the Navidrome logo freely to talk about Navidrome. This covers blog posts, YouTube thumbnails, conference slides, and icon packs for self-hosting dashboards.

**Keep the Navidrome logo as is.** Do not change the logo's colors or proportions, add new elements to it, or cut parts out. You can scale it to any size. Leave some empty space around it so it is clear that it is not part of nearby images. 

## Say you are independent

If you make an app, website, or service for Navidrome, say explicitely that it is an independent project. Include a line in your README, store description or About screen, such as:

> Foobar is an independent third-party client. It is not affiliated with or endorsed by the Navidrome project.

## Forks and packages

Navidrome's source code uses the [GPL-3.0 license](https://github.com/navidrome/navidrome/blob/master/LICENSE).
You can fork it, change it and share it. The license covers the code, not the name or logo.

- **Packages.** You can package and ship Navidrome (Docker images, Linux distributions, NAS app
  stores and similar) under the name Navidrome, with the logo. Small patches needed for packaging
  are allowed. Please link back to the official project.
- **Forks.** If you ship a modified version with new features or different behavior, give it a different name and a different logo. You can say it is "based on Navidrome".

## Anything else

For uses not covered here or to request permission, [open a discussion](https://github.com/navidrome/navidrome/discussions) on GitHub and ask. We may update this page over time. If we see a use that confuses users, we may ask you to change it.

</div>

{{% /blocks/section %}}
