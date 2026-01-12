# apps-filtering Specification

## Purpose
TBD - created by archiving change add-apps-filtering-search. Update Purpose after archive.
## Requirements
### Requirement: Platform Filtering
Users SHALL be able to filter apps by supported platforms.

#### Scenario: Filter by single platform
- **WHEN** a user selects the "Android" platform filter
- **THEN** only apps with `platforms.android` defined are displayed
- **AND** the URL updates to `/apps?platform=android`
- **AND** apps not supporting Android are hidden from view

#### Scenario: Filter by multiple platforms (OR logic)
- **WHEN** a user selects both "Android" and "iOS" platform filters
- **THEN** apps supporting Android OR iOS are displayed
- **AND** the URL updates to `/apps?platform=android,ios`
- **AND** an app supporting only iOS is shown
- **AND** an app supporting only Android is shown
- **AND** an app supporting neither is hidden

#### Scenario: All platforms selected equals no filter
- **WHEN** a user has all 6 platform checkboxes selected
- **THEN** all apps are displayed (equivalent to no filter)
- **AND** the URL does not include a `platform` parameter

---

### Requirement: API Support Filtering
Users SHALL be able to filter apps by API compatibility.

#### Scenario: Filter by OpenSubsonic API
- **WHEN** a user selects the "OpenSubsonic" API filter
- **THEN** only apps with `apis` containing "opensubsonic" (case-insensitive) are displayed
- **AND** the URL updates to `/apps?api=opensubsonic`

#### Scenario: Filter by multiple APIs (OR logic)
- **WHEN** a user selects both "OpenSubsonic" and "Navidrome" API filters
- **THEN** apps supporting OpenSubsonic OR Navidrome are displayed
- **AND** the URL updates to `/apps?api=opensubsonic,navidrome`

---

### Requirement: Open Source Filtering

Users SHALL be able to filter for open-source apps only.

#### Scenario: Show only open-source apps
- **WHEN** a user checks the "Open Source Only" filter
- **THEN** only apps with a `repoUrl` defined AND `isOpenSource` not set to `false` are displayed
- **AND** the URL updates to `/apps?oss=true`
- **AND** apps without a `repoUrl` are hidden
- **AND** apps with `isOpenSource: false` are hidden

#### Scenario: Uncheck open source filter
- **WHEN** a user unchecks the "Open Source Only" filter
- **THEN** all apps are displayed (subject to other active filters)
- **AND** the `oss` parameter is removed from the URL

---

### Requirement: Text Search
Users SHALL be able to search apps by name or description text.

#### Scenario: Search by app name
- **WHEN** a user types "dsub" in the search box
- **THEN** only apps with "dsub" in their name (case-insensitive) are displayed
- **AND** the URL updates to `/apps?q=dsub`

#### Scenario: Search by description keywords
- **WHEN** a user types "podcast" in the search box
- **THEN** apps with "podcast" in their name OR description are displayed
- **AND** the URL updates to `/apps?q=podcast`

#### Scenario: Search with partial match
- **WHEN** a user types "amp" in the search box
- **THEN** apps with names like "Amperfy" or descriptions containing "amp" are displayed
- **AND** search is case-insensitive substring matching

#### Scenario: Clear search
- **WHEN** a user clears the search box
- **THEN** all apps are displayed (subject to other active filters)
- **AND** the `q` parameter is removed from the URL

---

### Requirement: Combined Filtering
Multiple filters SHALL work together with AND logic across categories.

#### Scenario: Platform + API filter combination
- **WHEN** a user selects "Android" platform AND "OpenSubsonic" API
- **THEN** only apps that support Android AND OpenSubsonic are displayed
- **AND** the URL updates to `/apps?platform=android&api=opensubsonic`

#### Scenario: All filter types combined
- **WHEN** a user selects "iOS" platform AND "Navidrome" API AND "Open Source Only" AND searches for "offline"
- **THEN** only open-source iOS apps supporting Navidrome with "offline" in name/description are displayed
- **AND** the URL reflects all filters: `/apps?platform=ios&api=navidrome&oss=true&q=offline`

---

### Requirement: URL State Persistence
Filter state SHALL be stored in and restored from URL parameters.

#### Scenario: Load page with URL filters
- **WHEN** a user navigates to `/apps?platform=android&api=opensubsonic`
- **THEN** the "Android" platform checkbox is checked
- **AND** the "OpenSubsonic" API checkbox is checked
- **AND** only Android apps supporting OpenSubsonic are displayed

#### Scenario: Share filtered URL
- **WHEN** a user copies the URL `/apps?platform=linux&oss=true`
- **AND** shares it with another user
- **THEN** the recipient sees the same filtered view (Linux open-source apps)

#### Scenario: Browser back button
- **WHEN** a user applies filters (URL changes to `/apps?platform=ios`)
- **AND** clicks the browser back button
- **THEN** the previous filter state is restored
- **AND** the displayed apps update accordingly

---

### Requirement: Clear All Filters
Users SHALL be able to reset all filters to the default state.

#### Scenario: Clear all with button
- **WHEN** a user has active filters (platforms, APIs, OSS, search text)
- **AND** clicks the "Clear All Filters" button
- **THEN** all checkboxes are unchecked
- **AND** the search box is cleared
- **AND** all apps are displayed
- **AND** the URL updates to `/apps` (no parameters)

---

### Requirement: Results Count and Empty State
The page SHALL display the number of matching apps and handle empty results.

#### Scenario: Show results count
- **WHEN** filters are active and 5 out of 15 apps match
- **THEN** a message "Showing 5 of 15 apps" is displayed above the grid

#### Scenario: All apps shown
- **WHEN** no filters are active
- **THEN** the count message shows "Showing all 15 apps"

#### Scenario: No matching apps
- **WHEN** filters result in zero matching apps
- **THEN** the apps grid is hidden
- **AND** an empty state message is displayed: "No apps found"
- **AND** a suggestion to adjust filters or use the "Clear All Filters" button is shown

---

### Requirement: Responsive Filter UI
The filter interface SHALL adapt to different screen sizes.

#### Scenario: Desktop filter panel
- **WHEN** the viewport width is greater than 768px
- **THEN** the filter panel is always visible above the apps grid
- **AND** platform checkboxes are displayed in a horizontal row
- **AND** all filter controls fit in a compact layout

#### Scenario: Mobile filter panel (collapsed by default)
- **WHEN** the viewport width is 768px or less
- **THEN** the filter panel is collapsed by default
- **AND** a toggle button "Filter & Search" is displayed
- **AND** the button shows the total app count (e.g., "Filter & Search (15 apps)")

#### Scenario: Expand mobile filters
- **WHEN** a user clicks the "Filter & Search" toggle button on mobile
- **THEN** the filter panel expands below the button
- **AND** the button text changes to "Hide Filters"

#### Scenario: Mobile filter layout
- **WHEN** the filter panel is visible on mobile (<768px)
- **THEN** checkboxes are displayed in a vertical stack for easier touch targets
- **AND** the search box is full width
- **AND** buttons are full width for better touch accessibility

---

### Requirement: Data Attributes for Filtering

App cards SHALL include data attributes to enable client-side filtering.

#### Scenario: Open source data attribute
- **WHEN** an app card is rendered
- **AND** the app has a `repoUrl` defined
- **AND** the app has `isOpenSource` not set or set to `true`
- **THEN** the card has `data-oss="true"`

#### Scenario: Non-open-source app data attribute
- **WHEN** an app card is rendered
- **AND** the app has no `repoUrl` defined
- **OR** the app has `isOpenSource` set to `false`
- **THEN** the card has `data-oss="false"`

### Requirement: Accessibility
The filter interface SHALL be accessible to keyboard and screen reader users.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates via keyboard
- **THEN** they can Tab through the search box, all checkboxes, and the Clear All button
- **AND** pressing Enter on a focused checkbox toggles its state
- **AND** pressing Enter on the Clear All button clears all filters

#### Scenario: Screen reader announcements
- **WHEN** a filter is applied or cleared
- **THEN** the results count is announced to screen readers via `aria-live="polite"`
- **AND** the search input has `aria-label="Search apps by name or description"`
- **AND** the filter section has `role="search"`

#### Scenario: Focus management after clear
- **WHEN** a user clicks "Clear All Filters"
- **THEN** keyboard focus moves to the search input
- **AND** screen readers announce "Filters cleared, showing all apps"

