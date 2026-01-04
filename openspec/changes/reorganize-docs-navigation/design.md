# Design: Documentation Navigation Reorganization

## Context

The Navidrome documentation uses Hugo with the Docsy theme. The current structure has a flat "Usage" section with 18 pages at the same hierarchy level, making the left navigation menu long and difficult to scan.

## Design Decision: Sub-section Approach

### Option 1: Sub-sections within Usage (Selected)

Create subdirectories within `usage/` to group related content:

```
docs/
├── overview/
├── installation/
├── getting-started/
├── usage/
│   ├── _index.md
│   ├── configuration/
│   │   ├── _index.md
│   │   ├── options.md (from configuration-options.md)
│   │   ├── custom-tags.md (from customtags.md)
│   │   ├── persistent-ids.md (from pids.md)
│   │   ├── authentication.md (from externalized-authentication.md)
│   │   └── insights.md (from getting-started/insights/)
│   ├── features/
│   │   ├── _index.md
│   │   ├── smart-playlists.md
│   │   ├── multi-library.md
│   │   ├── jukebox.md
│   │   ├── sharing.md
│   │   └── scrobbling.md
│   ├── library/
│   │   ├── _index.md
│   │   ├── artwork.md
│   │   ├── tagging.md
│   │   ├── missing-files.md
│   │   └── exclude-content.md
│   ├── integration/
│   │   ├── _index.md
│   │   ├── external-services.md
│   │   └── monitoring.md
│   └── admin/
│       ├── _index.md
│       ├── backup.md
│       └── security.md
├── developers/
└── faq/
```

**Pros:**
- Clear logical groupings
- Collapsible sections in Docsy theme
- Scalable for future content
- URLs remain descriptive

**Cons:**
- Requires URL redirects for existing links
- Deeper URL paths

### Option 2: Top-level sections (Rejected)

Create new top-level sections alongside `usage/`.

**Rejected because:**
- Too many top-level entries
- Inconsistent with current structure
- Harder to maintain navigation order

## URL Redirect Strategy

Hugo's `aliases` front matter creates client-side redirects with:
- `<meta http-equiv="refresh">` for immediate redirect
- `<link rel="canonical">` for SEO

Example front matter for moved page:
```yaml
---
title: "Configuration Options"
aliases:
  - /docs/usage/configuration-options/
---
```

### Redirect Generation

Hugo automatically generates a page at the alias path containing:
```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <title>https://example.org/docs/usage/configuration/options/</title>
    <link rel="canonical" href="https://example.org/docs/usage/configuration/options/">
    <meta http-equiv="refresh" content="0; url=https://example.org/docs/usage/configuration/options/">
  </head>
</html>
```

This is the same mechanism already used in the project (see `installation/_index.md`, `external-integrations.md`, `linux.md`).

## Internal Link Update Strategy

1. **Search for all internal links** using pattern: `/docs/usage/[page-name]`
2. **Update to new paths** maintaining relative references where possible
3. **Validation**: Run Hugo build to detect broken links

Reference links at the bottom of markdown files (e.g., `[config]: /docs/usage/configuration-options`) will also be updated.

## Navigation Weight Assignment

Each new sub-section `_index.md` will have weights to control menu order:

| Sub-section | Weight | Description |
|-------------|--------|-------------|
| Configuration | 10 | First - essential setup info |
| Features | 20 | Core functionality |
| Library | 30 | Library management |
| Integration | 40 | External services |
| Admin | 50 | Administration tasks |

Individual pages within sub-sections will retain relative ordering.

## Alternative: Netlify Redirects (Not Selected)

While Netlify supports server-side redirects via `_redirects` file, Hugo's alias approach was chosen because:
- Consistent with existing project patterns
- Works regardless of hosting platform
- No additional configuration required
- Built-in canonical URL support
