---
title: Externalized Authentication Quick Start
linkTitle: Externalized Authentication
date: 2025-07-29
weight: 16
description: Quick Start guide
aliases:
  - /docs/getting-started/extauth-quickstart/
---

## What is externalized authentication

Externalized authentication allows you to use an external system to handle authentication for Navidrome.
Instead of managing user credentials in Navidrome itself, the responsibility is delegated to an external authentication service.

The external system comprises a reverse proxy (nginx, Caddy, Traefik, etc.) and an authentication service (Authelia, Authentik, or any other authentication service that works with your reverse proxy).

{{< alert title="For Beginners" color="primary" >}}
If you're new to reverse proxies, they act as intermediaries between your users and Navidrome.
They can handle things like SSL certificates, load balancing, and authentication before requests reach Navidrome.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │ --> │   Reverse   │ --> │  Navidrome  │
│   Browser   │     │    Proxy    │     │    Server   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          V
                    Authentication
                        Service
```
{{< /alert >}}

Navidrome supports a header-based mechanism to retrieve data about the authenticated user from the reverse proxy.

This approach is usually called "reverse proxy authentication", and offers several benefits:

* **Increased flexibility**: Leverage authentication methods not supported by Navidrome (LDAP, OAuth, 2FA, etc.)
* **Single Sign-On** (SSO): Users can login once and access multiple services
* **Centralized user management**: Manage all your users in one place

{{< alert title="Security Note" color="warning" >}}
**Navidrome works out of the box behind a reverse proxy without enabling externalized authentication.**

You only need to enable externalized authentication if you want the proxy to handle the authentication.
In other cases, enabling the feature without securing the reverse proxy configuration **can leave your Navidrome setup vulnerable** to impersonation attacks.
{{< /alert >}}

### How It Works

1. Your reverse proxy authenticates the user
2. The proxy adds a header with the username (e.g., `Remote-User: john`) to the request, then forwards it to Navidrome
3. Navidrome checks that the request comes from a trusted IP (using `ExtAuth.TrustedSources`, more on that below)
4. If trusted, Navidrome uses the username from the header to identify the user
5. If the user doesn't exist in Navidrome's database, a new account is created automatically

## Quick Start

Here's the basic process for setting up externalized authentication:

1. Configure your reverse proxy with authentication.
   The integration depend on the proxy and authentication service.
2. Configure the reverse proxy to pass the username to Navidrome via an HTTP header.
   It should additionally be configured to prevent clients from setting the header themselves.
3. Configure Navidrome to trust your reverse proxy as authentication source.
4. (Optional) Configure the reverse proxy to allow unauthenticated requests on specific paths.
   This is only needed for some Navidrome features.
5. Test the setup

### Basic Navidrome Configuration

By default, externalized authentication is disabled.
To enable it:

1. Set the `ExtAuth.TrustedSources` option to tell Navidrome which IP address to trust.
2. Optionally customize the `ExtAuth.UserHeader` option if your proxy uses a different header than the default `Remote-User`

In your Navidrome configuration:
```
## IP address of your reverse proxy (CIDR notation)
ND_EXTAUTH_TRUSTEDSOURCES=192.168.1.10/32
## Optional: Change the header if needed (this is the default)
ND_EXTAUTH_USERHEADER=Remote-User
```

{{< alert title="Security Note" color="warning" >}}
Only add IP addresses you trust to the trusted sources.
Navidrome will accept the username from any requests coming from these addresses without further verification.
{{< /alert >}}

#### Special Value for UNIX Sockets

If you're using UNIX sockets (with the `Address` option), use `@` in your `ExtAuth.TrustedSources` option to accept the authentication header of requests from the socket:

```
ND_ADDRESS=/var/run/navidrome.sock
ND_EXTAUTH_TRUSTEDSOURCES=@
```

### User Management

When using externalized authentication:

* The first user authenticated through the proxy will be granted admin privileges (just like the first user in a fresh installation)
* New users are created automatically with random passwords

You can also consider setting `EnableUserEditing=false` to prevent users from changing their Navidrome passwords (since they’re managed by your auth service):

```
# Disable password editing in Navidrome
ND_ENABLEUSEREDITING=false
```

### Reverse Proxy Integration

The integration depends on your chosen reverse proxy and authentication service, so you should first get familiar with their documentation.

Some Navidrome features also require specific configuration of your reverse proxy:
* **Public Shares**: If you plan to use Navidrome's sharing feature (for creating public links to your library), you need to configure your reverse proxy to bypass authentication for URLs starting with `/share/`, allowing unauthenticated access to the public shares.
* **Subsonic Clients**: For a basic setup, you can let Navidrome handle the Subsonic authentication by configuring your reverse proxy to bypass authentication for URLs starting with `/rest/`.
  Your users will have to set a password in Navidrome and use it with their Subsonic client (note that this is incompatible with `EnableUserEditing=false`).

We give some example configurations for popular reverse proxies.
You can adapt these to your specific setup.
Note that the examples might get outdated, you should always double-check the official documentation of your reverse proxy and authentication service.

#### Example: Caddy with Authentik

This example shows Navidrome behind Caddy with Authentik for authentication.

```Caddyfile
example.com {
   # Authentik output endpoint
   reverse_proxy /outpost.goauthentik.io/* http://authentik:9000

   # Protect everything except share and subsonic endpoints
   @protected not path /share/* /rest/*
   forward_auth @protected http://authentik:9000 {
      uri /outpost.goauthentik.io/auth/caddy
      copy_headers X-Authentik-Username>Remote-User
   }

   # Forward everything to Navidrome
   reverse_proxy navidrome:4533
}
```

#### Example: Traefik with Authelia

This example uses Traefik with Authelia for authentication, using Docker Compose.

```yaml
services:
  authelia:
    image: authelia/authelia:4.38.8
    labels:
      # Login page
      traefik.http.routers.authelia.rule: Host(`auth.example.com`)
      traefik.http.routers.authelia.entrypoints: https

      # Authentication middleware
      traefik.http.middlewares.authelia.forwardauth.address: http://authelia:9091/api/verify?rd=https://auth.example.com/
      traefik.http.middlewares.authelia.forwardauth.authResponseHeaders: Remote-User

  navidrome:
    image: deluan/navidrome:0.52.0
    labels:
      # Main Navidrome access with web authentication
      traefik.http.routers.navidrome.rule: Host(`music.example.com`)
      traefik.http.routers.navidrome.entrypoints: https
      traefik.http.routers.navidrome.middlewares: authelia@docker

      # Authentication bypass for share and subsonic endpoints
      traefik.http.routers.navidrome-public.rule: Host(`music.example.com`) && (PathPrefix(`/share/`) || PathPrefix(`/rest/`))
      traefik.http.routers.navidrome-public.entrypoints: https
    environment:
      # Trust all IPs in Docker network - use more specific IP if possible
      ND_EXTAUTH_TRUSTEDSOURCES: 0.0.0.0/0
```

## Security Considerations

Make sure to check the [Security Considerations](../security#externalized-authentication) page for important security information.

Key security points:
* Never run Navidrome as root
* Properly secure UNIX sockets if used
* Be careful with dynamic IP addresses in Docker environments
* Ensure that your reverse proxy is properly configured to remove the authentication header if set by clients (some, but not all, do it by default; some do it by default only for specific header names)

## Troubleshooting

Common issues and solutions:
1. **Authentication not working**
   - Check that your reverse proxy IP is in the `ExtAuth.TrustedSources` option and in CIDR format: `X.X.X.X/32`
   - Verify the correct that header is being sent by the reverse proxy (`Remote-User` by default)
   - Check the proxy logs to confirm that the authentication is successful

2. **New users not being created**
   - Ensure that the header contains the correct username
   - Check the Navidrome logs for any errors

3. **Subsonic clients can't connect**
   - Verify your proxy configuration for the `/rest/*` endpoint
   - Check if your client supports the authentication method you're using

4. **Shared links not working**
   - Make sure your proxy allows unauthenticated access to `/share/*` URLs

## FAQ

**Q: Can I use this with my existing OAuth provider?**<br>
A: Yes, as long as your reverse proxy can integrate with your OAuth provider and pass the username to Navidrome.

**Q: What if I want to switch back to Navidrome's authentication?**<br>
A: Remove or comment out the `ExtAuth.TrustedSources` configuration.

**Q: Can I mix authentication methods?**<br>
A: Yes, Navidrome will fall back to standard authentication if the reverse proxy header is not present or the request's source not trusted.

### See Also

- [Security Considerations](/docs/usage/admin/security) for Navidrome
- [Configuration Options](/docs/usage/configuration/options) for all available settings
- [Externalized Authentication](/docs/usage/configuration/authentication/) for the detailed documentation of the feature
- [Caddy Forward Auth documentation](https://caddyserver.com/docs/caddyfile/directives/forward_auth)
- [Traefik ForwardAuth middleware](https://doc.traefik.io/traefik/middlewares/http/forwardauth/)
