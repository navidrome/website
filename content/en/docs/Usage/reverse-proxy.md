---
title: "Reverse proxy authentication"
linkTitle: "Reverse proxy authentication"
date: 2024-04-27
weight: 60
description: >
  Delegate authentication to another system
---

## Configuration

By default, reverse proxy authentication is disabled. To enable the feature, either:
* Configure a trusted reverse proxy with the `ReverseProxyWhitelist` configuration option. The option takes an IPv4 or IPv6 range in CIDR notation.
* Configure a UNIX socket with the `Address` option.

When enabled via the `ReverseProxyWhitelist` option, Navidrome validates requests' source IP address against the `ReverseProxyWhitelist` configuration option. If the address doesn't match, reverse proxy authentication is not used even if the reverse proxy user header is present (see below), and falls back to a standard authentication mechanism.

With reverse proxy authentication enabled, Navidrome gets the username of the authenticated user from incoming requests' `Remote-User` HTTP header. The header can be changed via the `ReverseProxyUserHeader` configuration option.

If a user is successfully authenticated by the proxy but does not exist in the Navidrome DB, it will be created with a random password.

### Sharing endpoint

If you plan to use the Sharing feature, where you can create unauthenticated links to parts of your library, you'll need to whitelist the `/share/*` URLs.

### Subsonic endpoint

The subsonic endpoint also supports reverse proxy authentication, and will ignore the subsonic authentication parameters (`u`, `p`, `t` and `s`) if the reverse proxy user header is present. If the header is absent or has an empty value, Navidrome will fall back to the standard subsonic authentication scheme.

If your reverse proxy does not support the standard subsonic authentication scheme, or if the subsonic clients you want to use don't support an alternate authentication mechanism also supported by your proxy (such as BasicAuth), you can still configure your proxy to bypass authentication on `/rest/*` URLs and let Navidrome perform authentication for those requests. In that case, your users will have to update their (initially random) password in Navidrome, to use it with their subsonic client.

Note that the Navidrome web app uses a mix of internal and subsonic APIs, and receives subsonic credentials from the server. It is planned to address this (TODO: Create issue and add link), but in the meantime you will need to either configure your proxy to still bypass authentication on the subsonic endpoint for the Navidrome web app, identified as the subsonic client `NavidromeUI` (`c=NavidromeUI`) and let Navidrome handle that authentication, or use your standard authentication mechanism (e.g. relying on session cookies) for that client.

## Security

Make sure to check the reverse proxy authentication section in the dedicated [Security Considerations](../security#reverse-proxy-authentication) page.
