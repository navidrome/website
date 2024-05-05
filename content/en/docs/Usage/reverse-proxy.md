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

When enabled via the `ReverseProxyWhitelist` option, Navidrome validates the requests' source IP address against the range configured in `ReverseProxyWhitelist`. If the address doesn't match, reverse proxy authentication is not used even if the reverse proxy user header is present (see below), and falls back to a standard authentication mechanism.

With reverse proxy authentication enabled, Navidrome gets the username of the authenticated user from incoming requests' `Remote-User` HTTP header. The header can be changed via the `ReverseProxyUserHeader` configuration option.

If a user is successfully authenticated by the proxy but does not exist in the Navidrome DB, it will be created with a random password.

You might also be interested in the `EnableUserEditing` option, which allows disabling the User page that lets users change their Navidrome password.

### Sharing endpoint

If you plan to use the Sharing feature, where you can create unauthenticated links to parts of your library, you'll need to whitelist the `/share/*` URLs.

### Subsonic endpoint

The subsonic endpoint also supports reverse proxy authentication, and will ignore the subsonic authentication parameters (`u`, `p`, `t` and `s`) if the reverse proxy user header is present. If the header is absent or has an empty value, Navidrome will fall back to the standard subsonic authentication scheme.

If your reverse proxy does not support the standard subsonic authentication scheme, or if the subsonic clients you want to use don't support an alternate authentication mechanism also supported by your proxy (such as BasicAuth), you can still configure your proxy to bypass authentication on `/rest/*` URLs and let Navidrome perform authentication for those requests. In that case, your users will have to update their (initially random) password in Navidrome, to use it with their subsonic client.

{{< alert title="Note" >}}
Most reverse proxies and authentication services don't support the subsonic authentication scheme out of the box.

A handful of clients claim to support BasicAuth (e.g. DSub and Symfonium on Android, and play:Sub on iOS), but even then it might not work as you expect (as it is not standardized by the subsonic specification): you will likely need to generate a subsonic error response instead of a proper BasicAuth authentication failure response. Otherwise, some clients might display an unexpected error such as "server unreachable" when the credentials are incorrect, and other clients might refuse to connect altogether even with valid credentials.
{{< /alert >}}

### Navidrome Web App

The Navidrome web app uses a mix of internal and subsonic APIs, and receives subsonic credentials from the server to use for requests against the subsonic API. As the credentials received from the server likely won't match those in your dedicated authentication service, you need to handle subsonic requests from the Navidrome web app (identified as the subsonic client `NavidromeUI` via the `c` query parameter) in a special way. You can either:
* Ignore the subsonic authentication parameters and authenticate those requests the same way as non-subsonic requests. This relies on the fact that requests to the subsonic API will look the same to the proxy as requests to the internal API (e.g. same session cookies).
* Bypass authentication on your proxy for those requests and let Navidrome handle it. This relies on the fact that the web app receives the subsonic credentials from the server when it loads, and it can load only if the proxy has already authenticated the user.

Note that if you don't intend to support third-party subsonic clients, you can simply place the subsonic endpoint behind the same protection rule as the rest of the application, i.e. you don't need any special handling to bypass authentication.

## Security

Make sure to check the reverse proxy authentication section in the dedicated [Security Considerations](../security#reverse-proxy-authentication) page.

## Examples

For the examples below, it is assumed that you are familiar with the various products in use, i.e. reverse proxy, authentication service but also Navidrome.

The examples focus on the integration between the products, and provide configuration snippets stripped down to the relevant parts, which you can adapt to the specifics of your deployment.

### Caddy with forward_auth

In this example, Navidrome is behind the [Caddy](https://caddyserver.com) reverse proxy, and [Authentik](https://goauthentik.io) is used to authenticate requests, with the help of Caddy's [forward_auth](https://caddyserver.com/docs/caddyfile/directives/forward_auth) middleware.

`Caddyfile` excerpt stripped down to the relevant parts:
```Caddyfile
example.com

reverse_proxy /outpost.goauthentik.io/* http://authentik:9000

@protected not path /share/* /rest/*
forward_auth @protected http://authentik:9000 {
  uri /outpost.goauthentik.io/auth/caddy
  copy_headers X-Authentik-Username>Remote-User
}

# Authentik uses the Authorization header if present, so should be able to
# authenticate subsonic clients that support BasicAuth. Requests from the
# Navidrome Web App will be authenticated via the existing session cookie.
# If you want to have Navidrome authenticate subsonic requests, remove this
# forward_auth block.
@subsonic path /rest/*
forward_auth @subsonic http://authentik:9000 {
  uri /outpost.goauthentik.io/auth/caddy
  copy_headers X-Authentik-Username>Remote-User

  # Some clients that claim to support basicauth still expect a subsonic
  # response in case of authentication failure instead of a proper basicauth
  # response.
  @error status 1xx 3xx 4xx 5xx
  handle_response @error {
    respond <<SUBSONICERR
      <subsonic-response xmlns="http://subsonic.org/restapi" status="failed" version="1.16.1" type="proxy-auth" serverVersion="n/a" openSubsonic="true">
        <error code="40" message="Invalid credentials or unsupported client"></error>
      </subsonic-response>
      SUBSONICERR 200
  }
}

reverse_proxy navidrome:4533
```

Note that if you want to whitelist the unprotected paths as part of your Authentik configuration instead of doing it in Caddy, the `copy_headers` subdirective [won't work as expected](https://caddy.community/t/stop-copying-empty-forward-auth-header/17485): Authentik won't set the `X-Authentik-Username` header for whitelisted paths, but Caddy will still copy the header with an incorrect value. In order to make it work, you need a workaround:

```Caddyfile
forward_auth http://authentik:9000 {
  uri /outpost.goauthentik.io/auth/caddy
  # copy_headers subdirective removed
}

# Only set the Remote-User header if the request was actually authentified (user
# header set by Authentik), as opposed to whitelisted (user header not set).
@hasUsername `{http.reverse_proxy.header.X-Authentik-Username} != null`
request_header @hasUsername Remote-User {http.reverse_proxy.header.X-Authentik-Username}
```

### Traefik with ForwardAuth

In this example, Navidrome is behind the [Traefik](https://traefik.io) reverse proxy, and [Authelia](https://www.authelia.com) is used to authenticate requests, with the help of Traefik's [ForwardAuth](https://doc.traefik.io/traefik/middlewares/http/forwardauth/) middleware. Each service has its own subdomain. Docker Compose is used to deploy the whole thing.

The error response rewriting for subsonic authentication failure is not implemented, which means that subsonic clients are expected to handle correctly BasicAuth error responses (HTTP 401 with `WWW-Authenticate` header).

`docker-compose.yml` excerpt stripped down to the relevant parts:
```yaml
services:
  authelia:
    image: authelia/authelia:4.38.8
    labels:
      # The login page and user dashboard need to be reachable from the web
      traefik.http.routers.authelia.rule: Host(`auth.example.com`)
      traefik.http.routers.authelia.entrypoints: https
      # Standard authentication middleware to be used by web services
      traefik.http.middlewares.authelia.forwardauth.address: http://authelia:9091/api/verify?rd=https://auth.example.com/
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
      traefik.http.routers.navidrome.rule: Host(`music.example.com`)
      traefik.http.routers.navidrome.entrypoints: https
      traefik.http.routers.navidrome.middlewares: authelia@docker
      # Requests to the subsonic endpoint use the basicauth middleware, unless
      # they come from the Navidrome Web App ("NavidromeUI" subsonic client), in
      # which case the default authelia middleware is used.
      traefik.http.routers.navidrome-subsonic.rule: Host(`music.example.com`) && PathPrefix(`/rest/`) && !Query(`c`, `NavidromeUI`)
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

If you want to add support for the subsonic authentication scheme in order to support all subsonic clients, you can have a look at the Traefik plugin [BasicAuth adapter for Subsonic](https://plugins.traefik.io/plugins/6521c6de39e2d7caa2181888/basic-auth-adapter-for-subsonic) which transforms subsonic authentication parameters into a BasicAuth header that Authelia can handle, and performs the error response rewriting.
