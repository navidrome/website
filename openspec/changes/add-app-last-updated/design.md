# Design: App Last Updated Date

## Context
The `/apps` page displays client applications compatible with Navidrome. Users need visibility into how actively each app is maintained. This requires fetching release dates from various sources at build time and displaying them on app cards.

## Goals
- Fetch last release dates from GitHub, GitLab, Docker Hub, and GHCR
- Display dates in consistent `YYYY-MM-DD` format
- Gracefully handle failures with "N/A"
- Add sort functionality to the existing filter UI
- Maintain fast page loads (build-time fetching)

## Non-Goals
- Display version numbers or release notes
- Show commit activity
- Support every possible source (custom git forges → N/A)
- Real-time updates

## Technical Decisions

### Decision 1: Hugo Shortcode Architecture
**What**: Create a `lastUpdated` shortcode that accepts a URL and returns a formatted date.

**Why**: 
- Encapsulates API fetching logic in one place
- Reusable across different contexts if needed
- Hugo's `getJSON` caches responses during build
- Clean separation from template logic

**Implementation**:
```
{{ partial "last-updated.html" (dict "url" $repoUrl "platforms" $platforms) }}
```

The partial/shortcode will:
1. Detect source type from URL pattern
2. Call appropriate API endpoint
3. Parse response and extract date
4. Return formatted date or "N/A"

### Decision 2: Source Detection Strategy
**What**: Determine API source based on URL patterns and platform data.

**Priority order for fetching**:
1. `repoUrl` if present (GitHub, GitLab)
2. `platforms.docker.store` for Docker Hub/GHCR
3. Fall back to "N/A"

**URL Pattern Matching**:
| Pattern | Source | API Endpoint |
|---------|--------|--------------|
| `github.com/{owner}/{repo}` | GitHub | `api.github.com/repos/{owner}/{repo}/releases/latest` |
| `gitlab.com/{owner}/{repo}` | GitLab | `gitlab.com/api/v4/projects/{id}/releases` |
| `hub.docker.com/r/{owner}/{repo}` | Docker Hub | `hub.docker.com/v2/repositories/{owner}/{repo}/tags` |
| `ghcr.io/{owner}/{repo}` | GHCR | `api.github.com/users/{owner}/packages/container/{repo}/versions` |

### Decision 3: Error Handling
**What**: Graceful degradation when APIs fail or return unexpected data.

**Strategy**:
- Wrap all API calls in Hugo's `try` or use `with` for safe access
- Return "N/A" for any error condition:
  - Network failures
  - 404/rate limit responses
  - Missing release data (no releases published)
  - Parsing errors
- Log warnings during build for debugging (won't affect output)

### Decision 4: Date Extraction Logic
**What**: Extract and normalize dates from different API response formats.

| Source | Response Field | Format |
|--------|---------------|--------|
| GitHub | `published_at` | ISO 8601 |
| GitLab | `released_at` | ISO 8601 |
| Docker Hub | `tag_last_pushed` | ISO 8601 |
| GHCR | `updated_at` | ISO 8601 |

All dates normalized to `YYYY-MM-DD` using Hugo's `dateFormat`.

### Decision 5: Sort Implementation
**What**: Add client-side sorting to complement existing filtering.

**UI Changes**:
- Add "Sort by:" dropdown next to existing filter controls
- Options: "Name (A-Z)" (default), "Last Updated (Newest)"
- Sort by Last Updated: descending order, "N/A" entries at end

**Data Attribute**:
```html
<div class="app-card" data-last-updated="2025-12-15" ...>
```
Cards with "N/A" get `data-last-updated=""`

**JavaScript Logic**:
```javascript
function sortCards(sortBy) {
  const cards = Array.from(document.querySelectorAll('.app-card'));
  cards.sort((a, b) => {
    if (sortBy === 'updated') {
      const dateA = a.dataset.lastUpdated || '';
      const dateB = b.dataset.lastUpdated || '';
      // Empty strings (N/A) sort to end
      if (!dateA && dateB) return 1;
      if (dateA && !dateB) return -1;
      return dateB.localeCompare(dateA); // Descending
    }
    // Default: alphabetical by name
    return a.dataset.name.localeCompare(b.dataset.name);
  });
  // Re-append in new order
  const grid = document.querySelector('.apps-grid');
  cards.forEach(card => grid.appendChild(card));
}
```

### Decision 6: Display Location on Card
**What**: Show last updated date in the app card metadata section.

**Placement**: Below the platform icons, inline with API badge area.

**HTML Structure**:
```html
<div class="app-metadata">
  <div class="app-platforms">...</div>
  <div class="app-updated">
    <i class="fas fa-clock"></i>
    <span>2025-12-15</span>
  </div>
  <div class="app-apis">...</div>
</div>
```

**Styling**: Muted text, small font, clock icon for visual clarity.

## Risks / Trade-offs

### Risk 1: API Rate Limits
**Risk**: GitHub's unauthenticated rate limit is 60 requests/hour.  
**Mitigation**: 
- Hugo caches `getJSON` responses during build
- Daily builds means only ~30 requests/day
- If needed, add GitHub token as build secret

### Risk 2: API Response Changes
**Risk**: External APIs may change their response format.  
**Mitigation**: 
- Defensive parsing with fallbacks
- "N/A" as safe default
- Monitor build logs for warnings

### Risk 3: Slow Builds
**Risk**: Many sequential API calls could slow builds.  
**Mitigation**:
- Hugo processes templates in parallel where possible
- API responses are cached within a build
- Async fetching is Hugo's domain (we can't control it)

## Open Questions
1. Should we add a GitHub token for higher rate limits? (Probably not needed with ~30 apps)
2. Should the default sort change to "Last Updated"? (Recommend: keep "Name" as default for consistency)
