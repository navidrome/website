---
title: Externalized authentication
linkTitle: Externalized authentication
date: 2025-07-29
weight: 60
description: Delegate authentication to another system
---

## What is externalized authentication

Externalized authentication allows you to use an external system to handle authentication for Navidrome.
Instead of managing user credentials in Navidrome itself, the responsibility is delegated to the external authentication service.

The external system comprises a reverse proxy (nginx, Caddy, Traefik, etc.) and an authentication service (Authelia, Authentik, or any other authentication service that works with your reverse proxy).

{{< alert title="For Beginners" color="primary" >}}
If you're new to reverse proxies, they act as intermediaries between your users and Navidrome.
They can handle things like SSL certificates, load balancing, and authentication before requests reach Navidrome.
{{< /alert >}}

Navidrome supports a header-based mechanism to retrieve data about the authenticated user from the reverse proxy.

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
3. Navidrome checks that the request comes from a trusted IP (using `ReverseProxyWhitelist`, more on that below)
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

1. Set the `ReverseProxyWhitelist` option to tell Navidrome which IP address to trust.
2. Optionally customize the `ReverseProxyUserHeader` option if your proxy uses a different header than the default `Remote-User`

In your Navidrome configuration:
```
## IP address of your reverse proxy (CIDR notation)
ND_REVERSEPROXYWHITELIST=192.168.1.10/32
## Optional: Change the header if needed (defaults to Remote-User)
ND_REVERSEPROXYUSERHEADER=X-Auth-User
```

{{< alert title="Security Note" color="warning" >}}
Only add IP addresses you trust to the whitelist.
Navidrome will accept the username from any requests coming from these addresses without further verification.
{{< /alert >}}

#### Special Value for UNIX Sockets

If you're using UNIX sockets (with the `Address` option), use `@` in your `ReverseProxyWhitelist` option to accept the authentication header of requests from the socket:

```
ND_ADDRESS=/var/run/navidrome.sock
ND_REVERSEPROXYWHITELIST=@
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

We provide a few examples for some of them:
* [Traefik with Authelia](#TODO)
* [Caddy with Authentik](#TODO)

Note that the examples might get outdated, you should always double-check the official documentation of your reverse proxy and authentication service.

### Feature-Specific Configurations

#### Public Shares

If you plan to use Navidrome's Sharing feature (for creating public links to your library), you'll need to configure your reverse proxy to bypass authentication for URLs starting with `/share/`, allowing unauthenticated access to the public shares.

#### Subsonic Clients

The Subsonic API (used by mobile apps and third-party clients) can work with externalized authentication, but requires special consideration as no dedicated third-party authentication service supports Subsonic's authentication scheme out of the box.

For a basic setup, you can let Navidrome handle the Subsonic authentication:
* Configure your reverse proxy to bypass authentication for URLs starting with `/rest/`.
* Your users will have to set a password in Navidrome and use that one with their Subsonic client.
  Note that this is incompatible with `EnableUserEditing=false`.

## Security Considerations

Make sure to check the [Security Considerations](../security#externalized-authentication) page for important security information.

Key security points:
* Never run Navidrome as root
* Properly secure UNIX sockets if used
* Be careful with dynamic IP addresses in Docker environments
* Ensure your reverse proxy is properly configured to set the authentication header and remove the same header from client requests

## Troubleshooting

Common issues and solutions:
1. **Authentication not working**
   - Check that your reverse proxy IP is in the `ReverseProxyWhitelist` option and in CIDR format: `X.X.X.X/32`
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
A: Remove or comment out the `ReverseProxyWhitelist` configuration.

**Q: Can I mix authentication methods?**<br>
A: Yes, Navidrome will fall back to standard authentication if the reverse proxy header is not present or the request's source not trusted.

### See Also

- [Security Considerations](../security) for Navidrome
- [Configuration Options](../configuration-options) for all available settings
- [Caddy Forward Auth documentation](https://caddyserver.com/docs/caddyfile/directives/forward_auth)
- [Traefik ForwardAuth middleware](https://doc.traefik.io/traefik/middlewares/http/forwardauth/)
