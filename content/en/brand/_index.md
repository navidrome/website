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

We want people to build apps for Navidrome, write about it and show it off. We also want users to
know which apps come from the Navidrome project and which come from someone else. These rules
keep both of those true.

If your use follows this page, **you don't need to ask us**. This page is your permission. If an
app store reviewer asks for proof, send them a link to this page:
`https://www.navidrome.org/brand/`

## The short version

**You can, without asking:**

- Say your app or project works with Navidrome ("for Navidrome", "Navidrome compatible").
- Add Navidrome to your app's store name, after your own app name ("Minidisc - Navidrome & Lidarr").
- Show the Navidrome logo inside your app, next to a Navidrome server or login option.
- Use the name and logo in articles, videos, tutorials, talks and dashboards about Navidrome.
- Package and distribute unmodified Navidrome under its own name.

**You can't:**

- Call your app "Navidrome", or start its name with "Navidrome".
- Say or suggest that your app is official, or that the Navidrome project made, endorses or
  sponsors it.
- Use the Navidrome logo as your app icon, or as part of it.
- Change the logo, or make a new logo that looks like it.
- Sell merchandise with the Navidrome name or logo.

## Using the name

Write it as **Navidrome**: one word, capital N. Not "NaviDrome" or "Navi-drome".

**Describing compatibility.** Any accurate statement is fine. For example:

- "A music player for Navidrome"
- "Works with Navidrome and other Subsonic servers"
- "Navidrome compatible"

Keep it true. If your app only supports the Subsonic API, don't say it supports Navidrome-only
features.

**App and project names.** Your app needs its own name. You can add "Navidrome" after it to tell
people what it works with.

| OK | Not OK |
|----|--------|
| Minidisc - Navidrome & Lidarr | Navidrome |
| Foobar for Navidrome | Navidrome Mobile |
| Foobar: a Navidrome client | Navidrome Player by Foobar |
| | Navidrome Foobar |
| | Navidromer, Navydrome and other near-copies |

Names that share part of the word, like "Navi-something", are fine as long as they don't read as
"Navidrome". Many apps in our [catalog](/apps/) already do this.

**Domains and social accounts.** Don't register domains, app store accounts or social media
handles that look like they belong to the project, like `navidrome-app.com` or `@navidrome_music`.
Using `navidrome.yourdomain.com` for your own server is fine.

## Using the logo

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
- A badge on a server entry, so users can tell a Navidrome server from other kinds.

The logo should be the same size or smaller than the other server logos around it. It must not be
the main image of your app or of a screen.

**Your app icon and store listing.** Don't use the logo as your app icon, in your icon, or as the
main image of your store listing. Store screenshots can show the logo if it appears in your app
as described above.

**Articles, videos and dashboards.** Use it freely to talk about Navidrome. This covers blog posts,
YouTube thumbnails, conference slides, and icon packs for self-hosting dashboards.

**Keep it as is.** Don't change its colors or proportions, add parts to it, or cut parts out. You can
scale it to any size. Leave some empty space around it.

## Say you are independent

If you make an app, website or service for Navidrome, say that it is independent. Put a line like
this in your README, store description or About screen:

> Foobar is an independent third-party client. It is not affiliated with or endorsed by the
> Navidrome project.

## Forks and packages

Navidrome's source code uses the [GPL-3.0 license](https://github.com/navidrome/navidrome/blob/master/LICENSE).
You can fork it, change it and share it. The license covers the code, not the name or logo.

- **Packages.** You can package and ship Navidrome (Docker images, Linux distributions, NAS app
  stores and similar) under the name Navidrome, with the logo. Small patches needed for packaging
  are fine. Link back to the official project.
- **Forks.** If you ship a changed version with new features or different behavior, give it a
  different name and a different logo. You can say it is "based on Navidrome".

## Anything else

For uses not covered here, [open a discussion](https://github.com/navidrome/navidrome/discussions)
on GitHub and ask. We may update this page over time. If we see a use that confuses users, we may
ask you to change it.

</div>

{{% /blocks/section %}}
