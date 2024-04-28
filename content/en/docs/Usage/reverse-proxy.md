---
title: "Reverse proxy authentication"
linkTitle: "Reverse proxy authentication"
date: 2024-04-27
weight: 60
description: >
  Delegate authentication to another system
---

## Configuration

By default, reverse proxy authentication is disabled in Navidrome. To enable the feature, a trusted reverse proxy must be configured with the `ReverseProxyWhitelist` configuration option. The option takes an IPv4 or IPv6 range in CIDR notation.

When set, Navidrome validates requests' source IP address against the `ReverseProxyWhitelist` configuration option. If the address doesn't match, reverse proxy authentication is not used even if the reverse proxy user header is present (see below), and falls back to a standard authentication mechanism.

With reverse proxy authentication enabled, Navidrome gets the username of the authenticated user from incoming requests' `Remote-User` HTTP header. The header can be changed via the `ReverseProxyUserHeader` configuration option.

If a user is successfully authenticated by the proxy but does not exist in the Navidrome DB, it will be created with a random password.

### Sharing endpoint

If you plan to use the Sharing feature, where you can create unauthenticated links to parts of your library, you'll need to whitelist `/share/*` URLs.

### Subsonic endpoint

The subsonic endpoint also supports reverse proxy authentication, and will ignore the subsonic authentication parameters (`u`, `p`, `t` and `s`) if the reverse proxy user header is present. If the header is absent or has an empty value, Navidrome will fall back to the standard subsonic authentication scheme.

If your reverse proxy does not support the standard subsonic authentication scheme, or if the subsonic clients you want to use don't support an alternate authentication mechanism also supported by your proxy (such as BasicAuth), you can still configure your proxy to bypass authentication on `/rest/*` URLs and let Navidrome perform authentication for those requests. In that case, your users will have to update their (initially random) password in Navidrome, to use it with their subsonic client.

Note that the Navidrome web app uses a mix of internal and subsonic APIs, and receives subsonic credentials from the server. It is planned to address this (TODO: Create issue and add link), but in the meantime you will need to either configure your proxy to still bypass authentication on the subsonic endpoint for the Navidrome web app, identified as the subsonic client `NavidromeUI` (`c=NavidromeUI`) and let Navidrome handle that authentication, or use your standard authentication mechanism (e.g. relying on session cookies) for that client.

## Security considerations

### Listening on a UNIX socket

If you are listening on a UNIX socket, Navidrome will allow any connection to authenticate, as there is no remote IP exposed. Make sure to properly protect the socket with user access controls.

### Reverse proxy with a dynamic IP address

Navidrome does not support resolving hostnames in the `ReverseProxyWhitelist` configuration option.

In scenarios where the reverse proxy has a dynamic IP address, for example if you use docker-compose, you might need to use `0.0.0.0/0` to allow requests from the reverse proxy.

This creates an impersonation vulnerability, as Navidrome will blindly accept the value in the `Remote-User` header. For example, if you deploy multiple services with docker-compose, other services could potentially make requests to Navidrome and impersonate an admin.

### Potential HPP vulnerability

In the subsonic endpoint, if the reverse proxy user header is present and not empty, Navidrome will not require (if absent) and ignore (if present) the subsonic authentication parameters (`u`, `p`, `t` and `s`), so it should not be vulnerable to an HTTP Parameter Pollution vulnerability (where different systems use different credential sources to authenticate users) with respect to authentication.

In that sense, Navidrome does not adhere strictly to the subsonic protocol, which *requires* the subsonic authentication parameters.

It is still recommended configuring your proxy to strip those parameters from the query after the user has been authenticated to avoid potential HPP vulnerabilities in your deployment.

Note that opensubsonic specifies (and Navidrome supports) an [HTTP form POST extension](https://opensubsonic.netlify.app/docs/extensions/formpost/), and you should also scrub the subsonic authentication parameters from the body.
