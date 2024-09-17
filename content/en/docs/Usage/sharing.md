---
title: Sharing
linkTitle: Sharing your media
date: 2017-01-02
weight: 40
description: >
  How to create links to your media to be shared on Facebook, X, WhatsApp
---

{{< alert color="warning" title="NOTE" >}}
Please be aware that the Sharing feature is still under active development, and improvements to functionality and security are expected in future updates. Please report any issues or suggestions to the Navidrome GitHub issues page.
{{</alert>}}

Navidrome has a "Sharing" feature which allows users to generate a shareable link for a track, album, artist, or playlist. This link can then be sent to friends, allowing them to listen or download the music without having an account on your Navidrome instance.

### Enabling the Sharing Feature
As of version 0.49.3, the Sharing feature is disabled by default. To enable it, you need to adjust your Navidrome 
[configuration](/docs/usage/configuration-options). In your configuration file, set `EnableSharing=true`, or set the 
environment variable `ND_ENABLESHARING=true`.

Once the Sharing feature is enabled, all users will have access to all existing shares. This includes the ability to change the description and expiration date of the shares, as well as the capability to create new shares.

Please note that at this time, there is no way to set specific sharing permissions per user. This means that once the Sharing feature is enabled, all users have equal access and capabilities related to sharing. This includes the ability to view, modify, and create shares.

Due to this, we advise you to enable this feature only if you are comfortable with these permissions. Future updates may include more granular permission controls for sharing.

### Using the Sharing Feature
Once the Sharing feature is enabled, all users will be able to access current shares, modify descriptions and expiration, and create new ones. However, as of the initial implementation, there is currently no way to set permissions per user.

When browsing your music collection, you will notice a "Share" button or menu item available for each item, be it a track, album, artist, or playlist. To share an item, simply click on this "Share" button.

Upon clicking the "Share" button, a dialog box will appear, allowing you to configure your share. This includes setting a description other configurations for the share.

<p align="center">
<img width="400" src="/screenshots/share-dialog.png">
</p>

Once you have configured your share as desired, click the "Share" button. This will generate a unique shareable link, which you can then copy and share with your friends.

The generated sharable links will be in the following format: `http://yourserver.com/share/XXXXXXXXXX`. If you have Navidrome behind a reverse proxy, ensure you allow traffic to `/share`.

### Subsonic API Endpoints
The Sharing feature also implements the related Subsonic API endpoints. 
See the <a href="https://opensubsonic.netlify.app/categories/sharing/" target="_blank">API docs for implemented endpoints</a>

### Meta-tags to HTML
Meta-tags are added to the HTML to provide some information about the shared music on chat platforms. Example of a link shared in Discord:

<p align="center">
<img width="400" src="/screenshots/share-meta.png">
</p>
