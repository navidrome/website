---
title: Security Considerations
linkTitle: Security Considerations
date: 2017-01-02
weight: 20
description: >
  Information on how to making your installation more secure
aliases:
  - /docs/usage/security/
---


## Permissions

**You should NOT run Navidrome as `root`**. Ideally you should have it running under its own user. Navidrome only
needs read-only access to the Music Folder, and read-write permissions to the Data Folder.

## Encrypted passwords
To be able to keep compatibility with the Subsonic API and its clients, Navidrome needs to store user's passwords in its database. By default, Navidrome
encrypts the passwords in the DB with a shared encryption key, just for the sake of obfuscation as this key can be easily found in the codebase.

This key can be overridden by the config option `PasswordEncryptionKey`. Once this option is set and Navidrome is restarted, it will re-encrypt all passwords with this new key. This is a one-time only configuration, and after this point the config option cannot be changed anymore or else users won't be able to authenticate.

## Network configuration

Even though Navidrome comes with an embedded, full-featured HTTP server, you should seriously consider running it
behind a reverse proxy (Ex: Caddy, Nginx, Traefik, Apache) for added security, including setting up SSL.
There are tons of good resources on the web on how to properly setup a reverse proxy.

When using Navidrome in such configuration, you may want to prevent Navidrome from listening to all IPs configured
in your computer, and only listen to `localhost`. This can be achieved by setting the `Address` flag to `localhost`.

## Externalized authentication

When externalized authentication is enabled, Navidrome trusts the authenticated user header (configured with the `ExtAuth.UserHeader` option, by default `Remote-User`).

In principle, the authenticated user header is ignored if requests don't come from a reverse proxy trusted with the `ExtAuth.TrustedSources` option. This check can however be fooled by requests with a forged source IP address if the reverse proxy can be bypassed (e.g. a request sent by a compromised service running next to Navidrome).

When using externalized authentication in a fresh installation, the first user created through this method will automatically be granted admin privileges, consistent with the behavior when creating the first user through the web interface.

### Listening on a UNIX socket

If you are listening on a UNIX socket (`Address` option) and enable externalized authentication (`ExtAuth.TrustedSources` configured with the special value `@`), any process able to write to the socket can forge authenticated requests.

Make sure to properly protect the socket with user access controls (see the `UnixSocketPerm` option).

### Reverse proxy with a dynamic IP address

Navidrome does not support resolving hostnames in the `ExtAuth.TrustedSources` configuration option.

In scenarios where the reverse proxy has a dynamic IP address, for example when you use docker, you might consider using `0.0.0.0/0` to allow requests from the reverse proxy. This essentially disables the check, so you have to make sure that only the reverse proxy can send requests to Navidrome.

In particular with docker and docker-compose, without extra configuration containers are usually placed on the same default network and can therefore freely communicate.

### Potential HPP vulnerability

When externalized authentication is enabled, Navidrome currently does not disable the other authentication methods. This could potentially create an HTTP Parameter Pollution vulnerability if the reverse proxy is misconfigured, or due to a bug or oversight in Navidrome.

You should make sure that the authenticated user header is always set for requests against protected endpoints. As a rule of thumb, for an externalized authentication setup, the only endpoints that are not protected are `/rest/*` (depending on whether your proxy can handle the subsonic authentication scheme) and `/share/*`.

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
algorithm to block too many consecutive login attempts. It is enabled by default and you don't need to do anything.
The rate limiter can be fine tuned using the flags `AuthRequestLimit` and `AuthWindowLength` and can be disabled by
setting `AuthRequestLimit` to `0`, though it is not recommended.
