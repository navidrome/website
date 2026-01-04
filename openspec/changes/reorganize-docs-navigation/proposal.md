# Change: Reorganize Documentation Navigation

**Status**: ✅ Implemented

## Why

The documentation left menu has grown to ~33 pages spread across 7 top-level sections, making navigation cluttered and overwhelming. The "Usage" section alone contains 18 pages covering diverse topics from configuration to security. Users struggle to find relevant content, and the flat structure doesn't reflect logical groupings.

## What Changes

1. **Restructure Usage section** into logical sub-sections:
   - **Configuration** - configuration-options, custom tags, persistent IDs, externalized authentication, insights (anonymous data collection)
   - **Features** - smart playlists, multi-library, jukebox, sharing, scrobbling
   - **Library Management** - artwork, tagging guidelines, missing files, excluding content
   - **Integration** - external integrations, monitoring
   - **Administration** - backup, security

2. **Add URL aliases** for all moved pages to preserve existing URLs and SEO
   - Use Hugo's `aliases` front matter feature (generates redirect HTML pages)
   - Old URLs automatically redirect to new locations

3. **Remove draft content**
   - Delete `troubleshooting.md` (marked as draft, never published)

4. **Move Insights page** from Getting Started to Usage/Admin section

5. **Update all internal references** to use new canonical URLs
   - Fix ~60+ internal links across documentation and content files

## Impact

- **Affected specs**: None (this is a content organization change)
- **Affected code**: 
  - `content/en/docs/usage/` - restructure into subdirectories
  - `content/en/docs/` - internal links throughout all markdown files
  - No code changes required (Hugo built-in features only)
- **Breaking changes**: 
  - URLs will change for most usage pages
  - **MITIGATED** by Hugo aliases providing redirects from old URLs
- **SEO**: Aliases include `rel="canonical"` pointing to new URLs
