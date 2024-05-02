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

When enabled via the `ReverseProxyWhitelist` option, Navidrome validates the requests' source IP address against the `ReverseProxyWhitelist` configuration option. If the address doesn't match, reverse proxy authentication is not used even if the reverse proxy user header is present (see below), and falls back to a standard authentication mechanism.

With reverse proxy authentication enabled, Navidrome gets the username of the authenticated user from incoming requests' `Remote-User` HTTP header. The header can be changed via the `ReverseProxyUserHeader` configuration option.

If a user is successfully authenticated by the proxy but does not exist in the Navidrome DB, it will be created with a random password.

You might also be interested in the `EnableUserEditing` option, which allows disabling the User page that lets users change their Navidrome password.

### Sharing endpoint

If you plan to use the Sharing feature, where you can create unauthenticated links to parts of your library, you'll need to whitelist the `/share/*` URLs.

### Subsonic endpoint

The subsonic endpoint also supports reverse proxy authentication, and will ignore the subsonic authentication parameters (`u`, `p`, `t` and `s`) if the reverse proxy user header is present. If the header is absent or has an empty value, Navidrome will fall back to the standard subsonic authentication scheme.

If your reverse proxy does not support the standard subsonic authentication scheme, or if the subsonic clients you want to use don't support an alternate authentication mechanism also supported by your proxy (such as BasicAuth), you can still configure your proxy to bypass authentication on `/rest/*` URLs and let Navidrome perform authentication for those requests. In that case, your users will have to update their (initially random) password in Navidrome, to use it with their subsonic client.

### Navidrome Web App

The Navidrome web app uses a mix of internal and subsonic APIs, and receives subsonic credentials from the server to use for requests against the subsonic API. As the credentials received from the server likely won't match those in your dedicated authentication service, you need to handle subsonic requests from the Navidrome web app (identified as the subsonic client `NavidromeUI` via the `c` query parameter) in a special way. You can either:
* Ignore the subsonic authentication parameters and authenticate those requests the same way as non-subsonic requests. This relies on the fact that requests to the subsonic API will look the same to the proxy as requests to the internal API (e.g. same session cookies).
* Bypass authentication on your proxy for those requests and let Navidrome handle it. This relies on the fact that the web app receives the subsonic credentials when it loads, and it can load only if the proxy has already authenticated the user.

Note that if you don't intend to support third-party subsonic clients, you can simply place the subsonic endpoint behind the same protection rule as the rest of the application, i.e. you don't need any special handling to bypass authentication.

## Security

Make sure to check the reverse proxy authentication section in the dedicated [Security Considerations](../security#reverse-proxy-authentication) page.

## Example

In this example, Navidrome is behind the [Traefik](https://traefik.io) reverse proxy, and [Authelia](https://www.authelia.com) is used to authenticate requests, with the help of Traefik's [ForwardAuth](https://doc.traefik.io/traefik/middlewares/http/forwardauth/) middleware. Each service has its own subdomain. Docker Compose is used to deploy the whole thing.

The Navidrome Web App uses the standard authentication page from Authelia, and subsonic clients are expected to send credentials using BasicAuth.

This example does not go into the details of configuring Traefik, Authelia and Navidrome, but gives an overview of how those services can be integrated. If you need more details, Authelia has a pretty good documentation for integration with Traefik and other reverse proxies. Below is a `docker-compose.yml` excerpt stripped down to the relevant parts:

```yaml
authelia:
  image: authelia/authelia:4.38.8
  labels:
    # The login page and user dashboard need to be reachable from the web
    traefik.http.routers.authelia.rule: Host(`auth.${DOMAIN}`)
    traefik.http.routers.authelia.entrypoints: https
    # Standard authentication middleware to be used by web services
    traefik.http.middlewares.authelia.forwardauth.address: http://authelia:9091/api/verify?rd=https://auth.${DOMAIN}/
    traefik.http.middlewares.authelia.forwardauth.authResponseHeaders: Remote-User
    # Basicauth middleware for subsonic clients
    traefik.http.middlewares.authelia-basicauth.forwardauth.address: http://authelia:9091/api/verify?auth=basic
    traefik.http.middlewares.authelia-basicauth.forwardauth.authResponseHeaders: Remote-User

navidrome:
  image: deluan/navidrome:0.52.0
  labels:
    # Default rule which uses Authelia's web-based authentication. If you enable
    # navidrome's Sharing feature, you can configure Authelia to bypass
    # authentication for /share/* URLs, so you don't need an extra rule here.
    traefik.http.routers.navidrome.rule: Host(`music.${DOMAIN}`)
    traefik.http.routers.navidrome.entrypoints: https
    traefik.http.routers.navidrome.middlewares: authelia@docker
    # Requests to the subsonic endpoint use the basicauth middleware, unless
    # they come from the Navidrome Web App ("NavidromeUI" subsonic client), in
    # which case the default authelia middleware is used.
    traefik.http.routers.navidrome-subsonic.rule: Host(`music.${DOMAIN}`) && PathPrefix(`/rest/`) && !Query(`c`, `NavidromeUI`)
    traefik.http.routers.navidrome-subsonic.entrypoints: https
    traefik.http.routers.navidrome-subsonic.middlewares: authelia-basicauth@docker
  environment:
    # Navidrome does not resolve hostnames in this option, and by default
    # traefik will get assigned an IP address dynamically, so all IPs must be
    # trusted.
    # This means that any other service in the same docker network can make
    # requests to navidrome, and easily impersonate an admin.
    # If you assign a static IP to your traefik service, configure it here.
    ND_REVERSEPROXYWHITELIST: 0.0.0.0/0
    # Since authentication is entirely handled by Authelia, users don't need to
    # manage their password in Navidrome anymore.
    ND_ENABLEUSEREDITING: false
```

Note that only a handful of subsonic clients support BasicAuth (as it is not standardized by the subsonic specification), e.g. on Android DSub and Symfonium do, and on iOS play:Sub does. If you want to support all subsonic clients, you can have a look at the Traefik plugin [BasicAuth adapter for Subsonic](https://plugins.traefik.io/plugins/6521c6de39e2d7caa2181888/basic-auth-adapter-for-subsonic) which transforms subsonic authentication parameters into a BasicAuth header that Authelia can handle.
