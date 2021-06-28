---
title: Security Considerations
linkTitle: Security Considerations
date: 2017-01-05
description: >
  Information on how to making your installation more secure
---


## Permissions

**You should NOT run Navidrome as `root`**. Ideally you should have it running under its own user. Navidrome only
needs read-only access to the Music Folder, and read-write permissions to the Data Folder

## Network configuration

Even though Navidrome comes with an embedded, full-featured HTTP server, you should seriously consider running it
behind a reverse proxy (Ex: Caddy, Nginx, Traefik, Apache) for added security, including setting up SSL.
There are tons of good resources on the web on how to properly setup a reverse proxy.

When using Navidrome in such configuration, you may want to prevent Navidrome from listening to all IPs configured
in your computer, and only listen to `localhost`. This can be achieved by setting the `Address` flag to `localhost`

## Transcoding configuration

To configure transcoding, Navidrome's WebUI provide a screen that allows you to edit existing
transcoding configurations and to add new ones. That is similar to other music servers available
in the market that provide transcoding on-demand.

The issue with this is that it potentially allows an attacker to run any command in your server.
This married with the fact that some Navidrome installations don't use SSL and/or run it as a
super-user (_root_ or _Administrator_), is a recipe for disaster!

In an effort to make Navidrome as secure as possible, we decided to disable the transcoding
configuration editing in the UI by default. If you need to edit it (add or change a configuration),
start Navidrome with the `ND_ENABLETRANSCODINGCONFIG` set to `true`. After doing your changes,
don't forget to remove this option or set it to `false`.

## Limit login attempts

To protect against brute-force attacks, Navidrome is configured by default with a login rate limiter,
It uses a [Sliding Window](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/#slidingwindowstotherescue)
algorithm to block too many consecutive login attempts. This can be configured using the flags `AuthRequestLimit` and
`AuthWindowLength` and can be disabled by setting `AuthRequestLimit` to `0`, though it is not recommended.

## Reverse proxy authentication

When reverse proxy authentication is used, the verification is done by another system. By checking a specific HTTP header,
Navidrome assumes you are already authenticated. This header can be configured via `ReverseProxyUserHeader` configuration
option.  By default the `Remote-User` header is used.

By default, Navidrome denies every attempt. Authentication proxy needs to be whitelisted in CIDR format, using `ReverseProxyWhitelist`.
Both IPv4 and IPv6 are supported.

If you enable this feature and uses a Subsonic client, you must whitelist the Subsonic API URL, as this authentication method is 
incompatible with the Subsonic authentication. You will need to whitelist the `/rest/*` URLs

## Encrypted passwords
By default, Navidrome encrypts the passwords in the DB with a shared encryption key, just for the sake of obfuscation as this key can be easily found in 
the codebase.

This key can be overridden by the new config option `PasswordEncryptionKey`. Once this option is set and Navidrome is restarted, it will re-encrypt all passwords with this new key. This is a one-time only configuration, and after this point the config option cannot be changed anymore or users won't be able to authenticate.