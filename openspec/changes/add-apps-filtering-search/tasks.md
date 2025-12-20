# Implementation Tasks

## Phase 1: Data Attributes & Template Updates
### 1.1 Update app-card.html partial with data attributes
- [ ] Add `data-platforms` attribute with space-separated lowercase platform names
- [ ] Add `data-apis` attribute with space-separated lowercase API names
- [ ] Add `data-oss` attribute ("true" if repoUrl exists, "false" otherwise)
- [ ] Add `data-searchable` attribute with lowercase name + description
- [ ] Test: Verify data attributes render correctly for all existing apps
- **Acceptance**: Inspect DOM in browser, confirm all apps have correct data-* attributes

### 1.2 Validate existing app data
- [ ] Run through all `assets/apps/*/index.yaml` files
- [ ] Ensure `apis` field is consistently lowercase ("opensubsonic" or "navidrome")
- [ ] Document any inconsistencies and fix if needed
- **Acceptance**: All apps have valid, consistent data for filtering

---

## Phase 2: Filter UI Components
### 2.1 Create filter panel HTML in list.html
- [ ] Add filter section above `.apps-grid`
- [ ] Create search input with id="app-search" and aria-label
- [ ] Create platform checkboxes group (6 checkboxes: android, ios, windows, linux, macos, web)
- [ ] Create API checkboxes group (2 checkboxes: opensubsonic, navidrome)
- [ ] Create open-source checkbox (id="filter-oss")
- [ ] Add "Clear All Filters" button
- [ ] Add results count display element (id="results-count")
- [ ] Add empty state message element (id="empty-state", hidden by default)
- **Acceptance**: Filter UI renders on /apps page with all controls visible

### 2.2 Style filter panel (SCSS)
- [ ] Create `assets/scss/_app-filters.scss`
- [ ] Import into `assets/scss/_styles_project.scss`
- [ ] Style filter panel layout (desktop: compact horizontal, mobile: vertical)
- [ ] Style search box with icon
- [ ] Style checkboxes with labels (touch-friendly on mobile)
- [ ] Style Clear All button
- [ ] Style results count and empty state
- [ ] Add `.app-card--hidden` class with `display: none`
- [ ] Add responsive breakpoints matching grid (768px threshold)
- **Acceptance**: Filter panel looks polished on desktop and mobile

### 2.3 Mobile toggle button
- [ ] Add toggle button for mobile (<768px) with id="filter-toggle"
- [ ] Button text: "Filter & Search (X apps)" when collapsed, "Hide Filters" when expanded
- [ ] CSS to show/hide toggle button based on screen size
- [ ] CSS to collapse filter panel on mobile by default
- **Acceptance**: Toggle button appears on mobile, filter panel collapsible

---

## Phase 3: JavaScript Filtering Logic
### 3.1 Create app-filters.js module
- [ ] Create `assets/js/app-filters.js`
- [ ] Set up IIFE module pattern
- [ ] Add init() function with page detection (`.apps-grid` exists)
- [ ] Cache DOM element references (cards, inputs, buttons)
- **Acceptance**: Script loads only on /apps page, no console errors

### 3.2 Implement filter application logic
- [ ] Create `applyFilters()` function
- [ ] Read selected platforms from checkboxes
- [ ] Read selected APIs from checkboxes
- [ ] Read OSS filter state
- [ ] Read search query
- [ ] Loop through app cards:
  - Check platform match (OR logic within category)
  - Check API match (OR logic within category)
  - Check OSS match (AND logic)
  - Check search match (AND logic, substring in data-searchable)
- [ ] Toggle `.app-card--hidden` class based on match
- [ ] Count visible apps
- **Acceptance**: Filtering works correctly with AND/OR logic as specified

### 3.3 Update UI feedback
- [ ] Update results count element ("Showing X of Y apps" or "Showing all Y apps")
- [ ] Show/hide empty state based on match count
- [ ] Ensure results count has aria-live="polite" for screen readers
- **Acceptance**: Count updates correctly, empty state shows when no matches

### 3.4 Bind event listeners
- [ ] Add input event listener to search box (debounced 300ms)
- [ ] Add change event listeners to all checkboxes
- [ ] Add click event listener to Clear All button
- [ ] Add click event listener to mobile toggle button
- **Acceptance**: All interactions trigger filtering correctly

### 3.5 Implement Clear All functionality
- [ ] Clear search box value
- [ ] Uncheck all checkboxes
- [ ] Call `applyFilters()`
- [ ] Focus search input after clearing
- [ ] Update URL to /apps (no params)
- **Acceptance**: Clear All resets everything, focus moves to search

---

## Phase 4: URL State Management
### 4.1 URL parsing on page load
- [ ] Create `parseURL()` function using URLSearchParams
- [ ] Parse `platform` param (comma-separated) → array
- [ ] Parse `api` param (comma-separated) → array
- [ ] Parse `oss` param (true/false) → boolean
- [ ] Parse `q` param → search string
- [ ] Return filter state object
- **Acceptance**: URL params correctly parsed into filter state

### 4.2 Apply filters from URL on init
- [ ] Call `parseURL()` in init()
- [ ] Check appropriate checkboxes based on parsed state
- [ ] Set search input value
- [ ] Call `applyFilters()` to apply initial state
- **Acceptance**: Page loads with correct filters applied from URL

### 4.3 Update URL on filter change
- [ ] Create `updateURL()` function
- [ ] Serialize current filter state to URLSearchParams
- [ ] Use `history.pushState()` to update URL without reload
- [ ] Handle edge cases: all platforms selected = no param, empty search = no param
- [ ] Call from `applyFilters()` and `clearFilters()`
- **Acceptance**: URL updates on every filter change, browser back/forward works

---

## Phase 5: Responsive & Accessibility
### 5.1 Mobile filter panel behavior
- [ ] Toggle filter panel visibility on button click
- [ ] Update button text ("Filter & Search" ↔ "Hide Filters")
- [ ] Update button app count dynamically
- [ ] Ensure toggle only works on mobile (<768px)
- **Acceptance**: Mobile toggle works smoothly, desktop unaffected

### 5.2 Keyboard accessibility
- [ ] Test Tab navigation through all controls
- [ ] Test Enter key on checkboxes
- [ ] Test Enter key on Clear All button
- [ ] Test Escape key to close mobile filter panel (nice-to-have)
- **Acceptance**: All controls keyboard-accessible

### 5.3 Screen reader testing
- [ ] Verify aria-label on search input
- [ ] Verify role="search" on filter section
- [ ] Verify aria-live="polite" on results count
- [ ] Test with macOS VoiceOver or similar
- **Acceptance**: Screen readers announce filters and results correctly

---

## Phase 6: Testing & Validation
### 6.1 Browser testing
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test mobile browsers (iOS Safari, Chrome Android)
- [ ] Test with JavaScript disabled (graceful degradation)
- **Acceptance**: Works across major browsers, degrades gracefully without JS

### 6.2 Edge cases testing
- [ ] Test with 0 apps (empty state)
- [ ] Test with 1 app
- [ ] Test with all filters resulting in no matches
- [ ] Test URL sharing between users
- [ ] Test browser back/forward navigation
- [ ] Test rapid filter changes (debouncing)
- **Acceptance**: All edge cases handled gracefully

### 6.3 Performance testing
- [ ] Benchmark filtering with 50+ apps (simulate growth)
- [ ] Check for memory leaks (long session with many filter changes)
- [ ] Verify debouncing works (search doesn't lag)
- **Acceptance**: No performance issues with reasonable app count

---

## Phase 7: Documentation & Cleanup
### 7.1 Update README/docs
- [ ] Add section on filtering in user-facing docs (if needed)
- [ ] Update contributor guide if app YAML format expectations changed
- **Acceptance**: Documentation reflects new filtering feature

### 7.2 Code review & cleanup
- [ ] Review all code for clarity and maintainability
- [ ] Remove console.log statements
- [ ] Add inline comments for complex logic
- [ ] Ensure consistent code style
- **Acceptance**: Code is clean and well-documented

### 7.3 OpenSpec validation
- [ ] Run `openspec validate add-apps-filtering-search --strict`
- [ ] Fix any validation errors
- [ ] Ensure all scenarios have clear acceptance criteria
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
