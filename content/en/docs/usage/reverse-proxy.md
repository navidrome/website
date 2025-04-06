---
title: "Reverse proxy authentication"
linkTitle: "Reverse proxy authentication"
date: 2024-04-27
weight: 60
description: >
  Delegate authentication to another system
---

## What is Reverse Proxy Authentication?

Reverse proxy authentication allows you to use an external system (like your existing authentication service) to handle user login for Navidrome. Instead of managing user credentials in Navidrome itself, you can delegate this responsibility to services like Authelia, Authentik, or any authentication system that works with your reverse proxy (Nginx, Caddy, Traefik, etc.).

This approach offers several benefits:
- **Single sign-on**: Users can log in once and access multiple services
- **Centralized user management**: Manage all your users in one place
- **Enhanced security**: Leverage advanced authentication methods (2FA, OAuth, etc.)

{{< alert title="For Beginners" color="primary" >}}
If you're new to reverse proxies, they act as intermediaries between your users and Navidrome. They can handle things like SSL certificates, load balancing, and authentication before requests reach Navidrome.
{{< /alert >}}

## Quick Start

Here's the basic process for setting up reverse proxy authentication:

1. Configure your reverse proxy with authentication (varies by proxy)
2. Set up the reverse proxy to pass the username to Navidrome via HTTP header
3. Configure Navidrome to trust your reverse proxy
4. Test the setup

## Configuration

### Basic Navidrome Setup

By default, reverse proxy authentication is disabled. To enable it:

1. Set the `ReverseProxyWhitelist` option to tell Navidrome which IP addresses to trust
2. Optionally customize the `ReverseProxyUserHeader` if your proxy uses a different header than the default `Remote-User`

```
# In your Navidrome configuration:
ND_REVERSEPROXYWHITELIST=192.168.1.10/32  # IP address of your reverse proxy
# Optional: Change the header if needed (defaults to Remote-User)
ND_REVERSEPROXYUSERHEADER=X-Auth-User
```

{{< alert title="Security Note" color="warning" >}}
Only add IP addresses you trust to the whitelist. Navidrome will accept the username from any requests coming from these addresses without further verification.
{{< /alert >}}

### How It Works

When configured correctly:

1. Your reverse proxy authenticates the user
2. The proxy adds a header with the username (e.g., `Remote-User: john`)
3. Navidrome checks if the request comes from a trusted IP (in `ReverseProxyWhitelist`)
4. If trusted, Navidrome uses the username from the header to identify the user
5. If the user doesn't exist in Navidrome's database, a new account is created automatically

### Special Value for UNIX Sockets

If you're using UNIX sockets (with the `Address` option), add `@` to your `ReverseProxyWhitelist` to accept authentication from the socket:

```
ND_ADDRESS=/var/run/navidrome.sock
ND_REVERSEPROXYWHITELIST=@
```

## User Management

When using reverse proxy authentication:

- The first user authenticated through the proxy will be granted admin privileges (just like the first user in a fresh installation)
- New users are created automatically with random passwords 
- Consider setting `EnableUserEditing=false` to prevent users from changing their Navidrome passwords (since they're managed by your auth service)

```
# Disable password editing in Navidrome
ND_ENABLEUSEREDITING=false
```

## Feature-Specific Configurations

### Sharing Feature

If you plan to use Navidrome's Sharing feature (for creating unauthenticated links to your library), you'll need to:

1. Configure your reverse proxy to **bypass authentication** for URLs starting with `/share/`
2. This allows unauthenticated access to shared content via public links

### Subsonic API Integration

The Subsonic API (used by mobile apps and third-party clients) can work with reverse proxy authentication, but requires special consideration:

{{< alert title="Advanced Topic" >}}
This section is more advanced. For basic setup, you can skip this initially and return when you need to support Subsonic clients.
{{< /alert >}}

Navidrome's Subsonic API endpoint can use reverse proxy authentication in two ways:

1. **Proxy handles authentication**: The proxy authenticates users and passes the username to Navidrome
2. **Bypass mode**: The proxy allows unauthenticated access to `/rest/*` URLs, and Navidrome handles authentication

#### Option 1: Proxy Authentication for Subsonic

If your proxy and Subsonic clients support compatible authentication methods (like BasicAuth):

- Configure your proxy to authenticate requests to `/rest/*`
- Pass the authenticated username to Navidrome
- Navidrome will ignore standard Subsonic authentication parameters

#### Option 2: Bypass Authentication for Subsonic

If your clients don't support proxy authentication methods:

- Configure your proxy to bypass authentication for `/rest/*` URLs
- Let Navidrome handle authentication using standard Subsonic parameters
- Users will need to set passwords in Navidrome for their Subsonic clients

### Navidrome Web App Handling

The Navidrome web interface uses both internal and Subsonic APIs. You have two options:

1. **Same authentication for all requests**: Configure your proxy to authenticate all requests the same way
2. **Selective bypass**: Allow unauthenticated access to Subsonic API requests from the web app (identified by `c=NavidromeUI` parameter)

## Security Considerations

Make sure to check the [Security Considerations](../security#reverse-proxy-authentication) page for important security information.

Key security points:
- Never run Navidrome as root
- Properly secure UNIX sockets if used
- Be careful with dynamic IP addresses in Docker environments
- Ensure your reverse proxy is properly configured to set authentication headers

## Visual Guide

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │ --> │   Reverse   │ --> │  Navidrome  │
│   Browser   │     │    Proxy    │     │    Server   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          V
                    Authentication
                        System
```

## Example Configurations

Here are some example configurations for popular reverse proxies. You can adapt these to your specific setup.

### Caddy with Authentik

This example shows Navidrome behind Caddy with Authentik for authentication.

```Caddyfile
example.com {
    # Authentik outpost endpoint
    reverse_proxy /outpost.goauthentik.io/* http://authentik:9000

    # Protect everything except share and subsonic endpoints
    @protected not path /share/* /rest/*
    forward_auth @protected http://authentik:9000 {
        uri /outpost.goauthentik.io/auth/caddy
        copy_headers X-Authentik-Username>Remote-User
    }

    # Handle subsonic API authentication
    @subsonic path /rest/*
    forward_auth @subsonic http://authentik:9000 {
        uri /outpost.goauthentik.io/auth/caddy
        copy_headers X-Authentik-Username>Remote-User

        # Handle authentication errors
        @error status 1xx 3xx 4xx 5xx
        handle_response @error {
            respond <<SUBSONICERR
                <subsonic-response xmlns="http://subsonic.org/restapi" status="failed" version="1.16.1" type="proxy-auth" serverVersion="n/a" openSubsonic="true">
                    <error code="40" message="Invalid credentials or unsupported client"></e>
                </subsonic-response>
                SUBSONICERR 200
        }
    }

    # Forward everything to Navidrome
    reverse_proxy navidrome:4533
}
```

### Traefik with Authelia

This example uses Traefik with Authelia for authentication, using Docker Compose.

```yaml
services:
  authelia:
    image: authelia/authelia:4.38.8
    labels:
      # Login page
      traefik.http.routers.authelia.rule: Host(`auth.example.com`)
      traefik.http.routers.authelia.entrypoints: https
      
      # Standard web authentication
      traefik.http.middlewares.authelia.forwardauth.address: http://authelia:9091/api/verify?rd=https://auth.example.com/
      traefik.http.middlewares.authelia.forwardauth.authResponseHeaders: Remote-User
      
      # Basic auth for subsonic clients
      traefik.http.middlewares.authelia-basicauth.forwardauth.address: http://authelia:9091/api/verify?auth=basic
      traefik.http.middlewares.authelia-basicauth.forwardauth.authResponseHeaders: Remote-User

  navidrome:
    image: deluan/navidrome:0.52.0
    labels:
      # Main Navidrome access with web authentication
      traefik.http.routers.navidrome.rule: Host(`music.example.com`)
      traefik.http.routers.navidrome.entrypoints: https
      traefik.http.routers.navidrome.middlewares: authelia@docker
      
      # Special handling for subsonic API
      traefik.http.routers.navidrome-subsonic.rule: Host(`music.example.com`) && PathPrefix(`/rest/`) && !Query(`c`, `NavidromeUI`)
      traefik.http.routers.navidrome-subsonic.entrypoints: https
      traefik.http.routers.navidrome-subsonic.middlewares: authelia-basicauth@docker
    environment:
      # Trust all IPs in Docker network - use more specific IP if possible
      ND_REVERSEPROXYWHITELIST: 0.0.0.0/0
      # Disable password editing in Navidrome
      ND_ENABLEUSEREDITING: false
```

## Troubleshooting

Common issues and solutions:

1. **Authentication not working**
   - Check that your reverse proxy IP is in the `ReverseProxyWhitelist`
   - Verify the correct header is being sent (`Remote-User` by default)
   - Check proxy logs to confirm authentication is successful

2. **New users not being created**
   - Ensure the header contains the correct username
   - Check Navidrome logs for any errors

3. **Subsonic clients can't connect**
   - Verify your proxy configuration for the `/rest/*` endpoint
   - Check if your client supports the authentication method you're using

4. **Shared links not working**
   - Make sure your proxy allows unauthenticated access to `/share/*` URLs

## FAQ

**Q: Can I use this with my existing OAuth provider?**  
A: Yes, as long as your reverse proxy can integrate with your OAuth provider and pass the username to Navidrome.

**Q: What if I want to switch back to Navidrome's authentication?**  
A: Remove or comment out the `ReverseProxyWhitelist` configuration.

**Q: Can I mix authentication methods?**  
A: Yes, Navidrome will fall back to standard authentication if the reverse proxy header is not present.

## See Also

- [Security Considerations](../security) for Navidrome
- [Configuration Options](../configuration-options) for all available settings
- [Caddy Forward Auth documentation](https://caddyserver.com/docs/caddyfile/directives/forward_auth)
- [Traefik ForwardAuth middleware](https://doc.traefik.io/traefik/middlewares/http/forwardauth/)