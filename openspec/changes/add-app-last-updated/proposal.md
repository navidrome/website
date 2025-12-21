# Proposal: Add App Last Updated Date and Sort Option

## Summary
Display the last release date for each app on the `/apps` page and add a "Sort By" option to sort apps by this date (newest first), with apps showing "N/A" appearing at the end.

## Why
Users benefit from knowing how actively maintained an app is before investing time in it. A recently updated app suggests active development, bug fixes, and feature improvements. Currently, users must visit each app's repository or store page individually to check activity levels.

This enhancement helps users:
1. **Identify actively maintained apps**: Quickly spot apps with recent updates
2. **Avoid abandoned projects**: See at a glance if an app hasn't been updated in years
3. **Discover new releases**: Find apps that just shipped updates
4. **Make informed decisions**: Especially useful when choosing between similar apps

## Scope

### In Scope
- Hugo shortcode to fetch last release date at build time from:
  - **GitHub** (via GitHub API - releases endpoint)
  - **GitLab** (via GitLab API - releases endpoint)
  - **Docker Hub** (via Docker Hub API - tags endpoint)
  - **GitHub Container Registry (GHCR)** (via GitHub Packages API)
- Display date in `YYYY-MM-DD` format on each app card
- Show "N/A" when date cannot be retrieved or source is unsupported
- "Sort By" dropdown with options: "Name (A-Z)" (default), "Last Updated"
- Sort by Last Updated shows newest first, with "N/A" entries at the end
- URL state persistence for sort option (e.g., `?sort=updated`)
- Caching of fetched dates during build (daily builds via cron)

### Out of Scope
- Displaying release version numbers
- Showing commit activity or commit dates
- Release notes or changelogs
- Historical release data
- Manual override of dates in YAML files
- Real-time client-side date fetching

## Impact
- **End Users**: Better visibility into app maintenance status
- **Build Process**: Slightly longer builds due to API calls (mitigated by Hugo's caching)
- **Rate Limits**: GitHub API has 60 req/hour unauthenticated; GitLab similar. With ~30 apps, this is manageable
- **App Contributors**: No changes to contribution workflow

## Dependencies
- Existing `client-apps` spec
- Existing filtering/search JavaScript (needs sort functionality added)

## Alternatives Considered

### Alternative 1: Store dates in YAML files manually
**Approach**: Require app contributors to update a `lastUpdated` field  
**Pros**: No API calls, simple implementation  
**Cons**: Data goes stale, burden on contributors, hard to enforce  
**Decision**: Rejected - automated fetching is more reliable

### Alternative 2: Client-side fetching
**Approach**: Fetch dates via JavaScript in the browser  
**Pros**: Always fresh data  
**Cons**: Slower page load, CORS issues, rate limit concerns with many users  
**Decision**: Rejected - build-time fetching with daily cron is better UX

### Alternative 3: Only support GitHub
**Approach**: Limit to GitHub repos, show N/A for everything else  
**Pros**: Simpler implementation  
**Cons**: Poor experience for apps on GitLab, Docker Hub, or stores  
**Decision**: Rejected - worth supporting multiple sources for completeness
