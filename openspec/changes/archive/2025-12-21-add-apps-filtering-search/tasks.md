# Implementation Tasks

## Phase 1: Data Attributes & Template Updates
### 1.1 Update app-card.html partial with data attributes
- [x] Add `data-platforms` attribute with space-separated lowercase platform names
- [x] Add `data-apis` attribute with space-separated lowercase API names
- [x] Add `data-oss` attribute ("true" if repoUrl exists, "false" otherwise)
- [x] Add `data-searchable` attribute with lowercase name + description
- [x] Test: Verify data attributes render correctly for all existing apps
- **Acceptance**: Inspect DOM in browser, confirm all apps have correct data-* attributes

### 1.2 Validate existing app data
- [x] Run through all `assets/apps/*/index.yaml` files
- [x] Ensure `apis` field is consistently lowercase ("opensubsonic" or "navidrome")
- [x] Document any inconsistencies and fix if needed
- **Acceptance**: All apps have valid, consistent data for filtering

---

## Phase 2: Filter UI Components
### 2.1 Create filter panel HTML in list.html
- [x] Add filter section above `.apps-grid`
- [x] Create search input with id="app-search" and aria-label
- [x] Create platform checkboxes group (6 checkboxes: android, ios, windows, linux, macos, web)
- [x] Create API checkboxes group (2 checkboxes: opensubsonic, navidrome)
- [x] Create open-source checkbox (id="filter-oss")
- [x] Add "Clear All Filters" button
- [x] Add results count display element (id="results-count")
- [x] Add empty state message element (id="empty-state", hidden by default)
- **Acceptance**: Filter UI renders on /apps page with all controls visible

### 2.2 Style filter panel (SCSS)
- [x] Create `assets/scss/_app-filters.scss`
- [x] Import into `assets/scss/_styles_project.scss`
- [x] Style filter panel layout (desktop: compact horizontal, mobile: vertical)
- [x] Style search box with icon
- [x] Style checkboxes with labels (touch-friendly on mobile)
- [x] Style Clear All button
- [x] Style results count and empty state
- [x] Add `.app-card--hidden` class with `display: none`
- [x] Add responsive breakpoints matching grid (768px threshold)
- **Acceptance**: Filter panel looks polished on desktop and mobile

### 2.3 Mobile toggle button
- [x] Add toggle button for mobile (<768px) with id="filter-toggle"
- [x] Button text: "Filter & Search (X apps)" when collapsed, "Hide Filters" when expanded
- [x] CSS to show/hide toggle button based on screen size
- [x] CSS to collapse filter panel on mobile by default
- **Acceptance**: Toggle button appears on mobile, filter panel collapsible

---

## Phase 3: JavaScript Filtering Logic
### 3.1 Create app-filters.js module
- [x] Create `assets/js/app-filters.js`
- [x] Set up IIFE module pattern
- [x] Add init() function with page detection (`.apps-grid` exists)
- [x] Cache DOM element references (cards, inputs, buttons)
- **Acceptance**: Script loads only on /apps page, no console errors

### 3.2 Implement filter application logic
- [x] Create `applyFilters()` function
- [x] Read selected platforms from checkboxes
- [x] Read selected APIs from checkboxes
- [x] Read OSS filter state
- [x] Read search query
- [x] Loop through app cards:
  - Check platform match (OR logic within category)
  - Check API match (OR logic within category)
  - Check OSS match (AND logic)
  - Check search match (AND logic, substring in data-searchable)
- [x] Toggle `.app-card--hidden` class based on match
- [x] Count visible apps
- **Acceptance**: Filtering works correctly with AND/OR logic as specified

### 3.3 Update UI feedback
- [x] Update results count element ("Showing X of Y apps" or "Showing all Y apps")
- [x] Show/hide empty state based on match count
- [x] Ensure results count has aria-live="polite" for screen readers
- **Acceptance**: Count updates correctly, empty state shows when no matches

### 3.4 Bind event listeners
- [x] Add input event listener to search box (debounced 300ms)
- [x] Add change event listeners to all checkboxes
- [x] Add click event listener to Clear All button
- [x] Add click event listener to mobile toggle button
- **Acceptance**: All interactions trigger filtering correctly

### 3.5 Implement Clear All functionality
- [x] Clear search box value
- [x] Uncheck all checkboxes
- [x] Call `applyFilters()`
- [x] Focus search input after clearing
- [x] Update URL to /apps (no params)
- **Acceptance**: Clear All resets everything, focus moves to search

---

## Phase 4: URL State Management
### 4.1 URL parsing on page load
- [x] Create `parseURL()` function using URLSearchParams
- [x] Parse `platform` param (comma-separated) → array
- [x] Parse `api` param (comma-separated) → array
- [x] Parse `oss` param (true/false) → boolean
- [x] Parse `q` param → search string
- [x] Return filter state object
- **Acceptance**: URL params correctly parsed into filter state

### 4.2 Apply filters from URL on init
- [x] Call `parseURL()` in init()
- [x] Check appropriate checkboxes based on parsed state
- [x] Set search input value
- [x] Call `applyFilters()` to apply initial state
- **Acceptance**: Page loads with correct filters applied from URL

### 4.3 Update URL on filter change
- [x] Create `updateURL()` function
- [x] Serialize current filter state to URLSearchParams
- [x] Use `history.pushState()` to update URL without reload
- [x] Handle edge cases: all platforms selected = no param, empty search = no param
- [x] Call from `applyFilters()` and `clearFilters()`
- **Acceptance**: URL updates on every filter change, browser back/forward works

---

## Phase 5: Responsive & Accessibility
### 5.1 Mobile filter panel behavior
- [x] Toggle filter panel visibility on button click
- [x] Update button text ("Filter & Search" ↔ "Hide Filters")
- [x] Update button app count dynamically
- [x] Ensure toggle only works on mobile (<768px)
- **Acceptance**: Mobile toggle works smoothly, desktop unaffected

### 5.2 Keyboard accessibility
- [x] Test Tab navigation through all controls
- [x] Test Enter key on checkboxes
- [x] Test Enter key on Clear All button
- [x] Test Escape key to close mobile filter panel (nice-to-have)
- **Acceptance**: All controls keyboard-accessible

### 5.3 Screen reader testing
- [x] Verify aria-label on search input
- [x] Verify role="search" on filter section
- [x] Verify aria-live="polite" on results count
- [x] Test with macOS VoiceOver or similar
- **Acceptance**: Screen readers announce filters and results correctly

---

## Phase 6: Testing & Validation
### 6.1 Browser testing
- [x] Test in Chrome, Firefox, Safari
- [x] Test mobile browsers (iOS Safari, Chrome Android)
- [x] Test with JavaScript disabled (graceful degradation)
- **Acceptance**: Works across major browsers, degrades gracefully without JS

### 6.2 Edge cases testing
- [x] Test with 0 apps (empty state)
- [x] Test with 1 app
- [x] Test with all filters resulting in no matches
- [x] Test URL sharing between users
- [x] Test browser back/forward navigation
- [x] Test rapid filter changes (debouncing)
- **Acceptance**: All edge cases handled gracefully

### 6.3 Performance testing
- [x] Benchmark filtering with 50+ apps (simulate growth)
- [x] Check for memory leaks (long session with many filter changes)
- [x] Verify debouncing works (search doesn't lag)
- **Acceptance**: No performance issues with reasonable app count

---

## Phase 7: Documentation & Cleanup
### 7.1 Update README/docs
- [x] Add section on filtering in user-facing docs (if needed)
- [x] Update contributor guide if app YAML format expectations changed
- **Acceptance**: Documentation reflects new filtering feature

### 7.2 Code review & cleanup
- [x] Review all code for clarity and maintainability
- [x] Remove console.log statements
- [x] Add inline comments for complex logic
- [x] Ensure consistent code style
- **Acceptance**: Code is clean and well-documented

### 7.3 OpenSpec validation
- [x] Run `openspec validate add-apps-filtering-search --strict`
- [x] Fix any validation errors
- [x] Ensure all scenarios have clear acceptance criteria
- **Acceptance**: OpenSpec validation passes

---

## Dependencies & Parallelization
- **Can work in parallel**:
  - Phase 1.1 (data attributes) + Phase 2.1/2.2 (UI components)
  - Phase 5.2 (keyboard) + Phase 5.3 (screen reader) testing
  
- **Sequential dependencies**:
  - Phase 1 must complete before Phase 3 (JS needs data attributes)
  - Phase 3 must complete before Phase 4 (URL state needs working filters)
  - Phase 2 + Phase 3 must complete before Phase 5 (responsive/a11y needs working UI + JS)
  - All phases must complete before Phase 6 (testing)

---

## Estimated Timeline
- Phase 1: 2 hours
- Phase 2: 3 hours
- Phase 3: 4 hours
- Phase 4: 2 hours
- Phase 5: 2 hours
- Phase 6: 3 hours
- Phase 7: 1 hour

**Total**: ~17 hours (~2-3 days of focused work)
