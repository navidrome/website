# Proposal: Add Apps Filtering and Search

## Summary
Add client-side filtering and search capabilities to the `/apps` page to help users quickly find compatible client applications by platform, API support, open-source status, and text search.

## Why
As the Navidrome client app ecosystem grows, users struggle to find apps matching their specific needs (platform, features, open-source preference). Currently, they must scroll through an alphabetically-sorted list of all apps, which becomes increasingly inefficient as more apps are added. This change directly improves user experience by:

1. **Reducing time to find relevant apps**: Users can instantly filter to their platform (e.g., "Android only") instead of scanning the entire list
2. **Supporting discovery by features**: Users exploring API compatibility or seeking open-source options can filter accordingly
3. **Enabling quick search**: Users who know the app name can type to find it immediately
4. **Improving shareability**: URL parameters allow users to share filtered views (e.g., "here are all Linux apps")

Without this change, the apps page will become less usable as the app count grows beyond 20-30 entries. Implementing filtering now establishes a scalable foundation for future growth.

## Motivation
As the number of client applications grows, users need an efficient way to discover apps that match their specific requirements. Currently, users must scroll through the entire alphabetically-sorted grid to find apps for their platform or with specific features. This enhancement will significantly improve discoverability and user experience.

### User Stories
- **As a mobile user**, I want to filter apps by platform (Android/iOS) so I can quickly find apps compatible with my device
- **As a Linux user**, I want to find desktop apps that work on my OS without scrolling through mobile-only apps
- **As a developer**, I want to filter for open-source apps so I can study their implementation or contribute
- **As a user searching for a specific app**, I want to type its name to quickly locate it
- **As a user exploring features**, I want to filter by API support (OpenSubsonic vs Navidrome-specific) to understand compatibility

## Scope

### In Scope
- Client-side JavaScript filtering (no backend changes)
- Filter by platform (Android, iOS, Windows, Linux, macOS, Web)
- Filter by API support (OpenSubsonic, Navidrome)
- Filter by open-source status (has repo URL)
- Text search across app name and description
- Multi-select filters (combine multiple platforms/APIs)
- Clear all filters button
- Responsive filter UI for mobile/desktop
- URL state persistence (filters reflected in URL params for sharing)

### Out of Scope
- Backend/server-side search
- Advanced search operators (AND/OR/NOT)
- Sorting options (keep alphabetical only)
- User ratings or reviews
- Filtering by store availability
- Saved filter preferences
- Analytics on filter usage

## Impact
- **End Users**: Faster app discovery, better UX especially as app count grows
- **Contributors**: No impact on contribution workflow (still just YAML files)
- **Maintainers**: Minimal maintenance - client-side JS is self-contained
- **Performance**: Negligible - filtering on small dataset (~10-50 apps)

## Dependencies
- Requires existing `client-apps` spec (already implemented)
- No external library dependencies (vanilla JS)

## Timeline
- **Design & Review**: 1 day
- **Implementation**: 2-3 days
- **Testing**: 1 day
- **Total**: ~1 week

## Alternatives Considered

### Alternative 1: Backend Search with Index
**Approach**: Use Hugo's search index generation + Fuse.js for fuzzy search  
**Pros**: More powerful search, fuzzy matching  
**Cons**: Adds build complexity, larger bundle, overkill for small dataset  
**Decision**: Rejected - vanilla JS filtering is sufficient for current app count

### Alternative 2: No URL State
**Approach**: Filters only in memory, not in URL  
**Pros**: Simpler implementation  
**Cons**: Can't share filtered views, poor UX  
**Decision**: Rejected - URL state is valuable for sharing

### Alternative 3: Separate Search Box + Filters
**Approach**: Distinct UI sections for search vs filters  
**Pros**: Clearer separation of concerns  
**Cons**: More UI clutter, especially on mobile  
**Decision**: Accepted - see design.md (search above filters, both clearly separated)
