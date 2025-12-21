## Context

The existing `/apps` page displays client applications in a static alphabetically-sorted grid. As the number of apps grows (currently 6, potentially dozens in the future), users need a way to quickly filter and search for apps matching their requirements.

### Current State
- Apps displayed in responsive grid (4/3/2/1 columns based on screen size)
- Each app card shows: thumbnail, name, description, platforms, APIs, OSS badge
- Static sorting: alphabetical by name
- No filtering or search capabilities
- Apps loaded from `assets/apps/*/index.yaml` at build time

### Stakeholders
- **End Users**: Primary beneficiaries - faster app discovery
- **App Developers**: Indirect benefit - their apps more discoverable
- **Navidrome Maintainers**: Minimal maintenance burden required

## Goals / Non-Goals

### Goals
- **Instant filtering**: No page reloads, client-side only
- **Multi-dimensional filtering**: Combine platform, API, and OSS filters
- **Text search**: Search app name and description simultaneously
- **URL sharing**: Filter state in URL params (e.g., `/apps?platform=android&api=opensubsonic`)
- **Mobile-friendly**: Collapsible filter panel on small screens
- **Accessible**: Keyboard navigation, screen reader support
- **Zero dependencies**: Vanilla JavaScript, no external libs

### Non-Goals
- Server-side search or indexing
- Fuzzy/typo-tolerant search (exact substring matching is sufficient)
- Filter persistence across sessions (cookies/localStorage)
- Sorting options (alphabetical is sufficient)
- Analytics tracking of filter usage
- i18n/translations (English only, matching current site)

## Decisions

### Decision 1: Client-Side Filtering with Data Attributes
**Why**: 
- App dataset is small (~10-50 apps max)
- No backend/API needed
- Instant results without network latency
- Simple to implement and maintain
- Works with existing Hugo template structure

**Implementation**:
- Add `data-*` attributes to each `.app-card`:
  - `data-platforms="android ios"` (space-separated)
  - `data-apis="opensubsonic navidrome"` (space-separated)
  - `data-oss="true|false"`
  - `data-searchable="app name description text"` (lowercase, normalized)
- JavaScript filters by toggling `.app-card--hidden` class
- CSS handles visibility with `display: none`

**Alternatives Considered**:
- JSON dataset → Requires re-rendering DOM, more complex
- Hugo-generated search index → Overkill for small dataset

---

### Decision 2: Filter UI Layout

**Desktop (>768px)**: Compact 2-line horizontal layout
```
Line 1: [Search box.....................🔍] Platform: [Android] [iOS] [Windows] [Linux] [macOS] [Web]
Line 2: API: [OpenSubsonic] [Navidrome]  [x] Open Source Only  [Clear All Filters]
```

All filter controls fit in maximum 2 lines, utilizing horizontal space efficiently.

**Mobile (<768px)**: Collapsible panel with toggle button, vertical stacked layout
```
┌─────────────────────────────────────┐
│  [Search box                     🔍] │
├─────────────────────────────────────┤
│  Platform:                          │
│  [Android] [iOS] [Windows]          │
│  [Linux] [macOS] [Web]              │
├─────────────────────────────────────┤
│  API:                               │
│  [OpenSubsonic] [Navidrome]         │
├─────────────────────────────────────┤
│  [x] Open Source Only               │
├─────────────────────────────────────┤
│  [Clear All Filters]                │
└─────────────────────────────────────┘
```

**Why**:
- Desktop: Maximize horizontal space - all filters visible without scrolling
- Search + platforms on line 1 (most frequently used)
- APIs + OSS + Clear All on line 2 (less frequent, grouped logically)
- Compact layout doesn't push content down excessively
- Mobile: Vertical stack for better touch targets and readability

---

### Decision 3: URL State Management
Use URL search parameters to store active filters:
- `/apps` → No filters
- `/apps?platform=android` → Android apps only
- `/apps?platform=android,ios&api=opensubsonic` → Android/iOS apps supporting OpenSubsonic
- `/apps?platform=linux&oss=true&q=music` → Linux OSS apps matching "music"

**Benefits**:
- Shareable filtered views
- Browser back/forward navigation works
- No localStorage needed
- SEO-friendly (though filters are client-side, base URL is still crawlable)

**Implementation**:
- Read params on page load via `URLSearchParams`
- Update URL on filter change via `history.pushState()` (no reload)
- Parse params: `platform=android,ios` → `["android", "ios"]`

---

### Decision 4: Filter Logic (AND vs OR)
- **Within a category** (e.g., platforms): **OR** logic
  - Selecting Android + iOS shows apps supporting Android OR iOS
- **Across categories**: **AND** logic
  - Selecting Android + OpenSubsonic shows apps supporting Android AND OpenSubsonic
- **Text search**: **AND** with filters
  - Searching "music" + selecting Android shows Android apps containing "music"

**Why**: Matches user expectations and provides useful filtering combinations

**Example**:
```
Filters: platform=android,ios + api=opensubsonic + q=offline
Result: Apps that support (Android OR iOS) AND OpenSubsonic AND contain "offline" in name/description
```

---

### Decision 5: Empty State Handling
When no apps match current filters:
```
┌─────────────────────────────────────┐
│  🔍 No apps found                   │
│                                     │
│  Try adjusting your filters or      │
│  [Clear All Filters]                │
└─────────────────────────────────────┘
```

Shows count when results exist:
```
Showing 5 of 15 apps
```

---

### Decision 6: Responsive Behavior
**Desktop (>768px)**:
- Filter panel always visible above grid
- 2-line horizontal layout maximizing screen width
- Line 1: Search + Platform checkboxes (inline)
- Line 2: API checkboxes + OSS checkbox + Clear All button (inline)
- Compact spacing between controls

**Tablet (577-768px)**:
- Filter panel collapsible via toggle button
- Default: collapsed (grid visible immediately)
- Button: "Filter & Search (15 apps)" / "Hide Filters"
- When expanded: same 2-line horizontal layout as desktop

**Mobile (<576px)**:
- Filter panel collapsed by default
- Full-width buttons for better touch targets
- Toggle button sticky at top for easy access
- When expanded: vertical stacked layout (search, platforms, APIs, OSS, clear)

---

### Decision 7: JavaScript Architecture
Single file: `assets/js/app-filters.js`

```javascript
// Module pattern
(function() {
  const AppFilters = {
    init() {
      // Bind event listeners
      // Parse URL params
      // Apply initial filters
    },
    
    applyFilters() {
      // Read selected filters
      // Filter app cards via data attributes
      // Update URL
      // Show/hide empty state
    },
    
    updateURL() {
      // Serialize filters to URL params
      // Push state
    },
    
    parseURL() {
      // Parse URLSearchParams
      // Return filter state
    }
  };
  
  if (document.querySelector('.apps-grid')) {
    AppFilters.init();
  }
})();
```

**Why**:
- Self-contained module
- Only runs on `/apps` page (guards with selector check)
- No global pollution
- Easy to test and maintain

---

### Decision 8: Accessibility
- All checkboxes have proper `<label>` elements
- Search input has `aria-label="Search apps"`
- Filter panel has `role="search"` for screen readers
- Keyboard navigation: Tab through filters, Enter to toggle
- Results count announced to screen readers via `aria-live="polite"`
- Focus management: Clear button focuses search input after clearing

## Risks / Trade-offs

| Risk | Mitigation | Severity |
|------|------------|----------|
| JavaScript disabled | Graceful degradation: all apps still visible | Low |
| Large app count (100+) | Performance testing, consider virtualization later | Low |
| Filter state complexity | Clear All button, simple URL parsing | Low |
| Mobile UX clutter | Collapsible panel, defaults to hidden | Medium |
| Conflicting filters (no results) | Clear empty state message, easy reset | Low |

## Open Questions
- ~~Should filter panel be expanded by default on desktop?~~ **Yes**, collapsed on mobile only
- ~~Should we track filter usage in analytics?~~ **No**, out of scope for now (can add later if needed)
- ~~Should "Clear All" clear search text too?~~ **Yes**, resets entire filter state
