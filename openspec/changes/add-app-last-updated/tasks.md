# Tasks: Add App Last Updated Date

## 1. Create Last Updated Shortcode/Partial
- [ ] 1.1 Create `layouts/partials/last-updated.html` partial that accepts URL and platforms dict
- [ ] 1.2 Implement GitHub API fetching (`api.github.com/repos/{owner}/{repo}/releases/latest`)
- [ ] 1.3 Implement GitLab API fetching (`gitlab.com/api/v4/projects/{encoded-path}/releases`)
- [ ] 1.4 Implement Docker Hub API fetching (`hub.docker.com/v2/repositories/{owner}/{repo}/tags?page_size=1&ordering=last_updated`)
- [ ] 1.5 Implement GHCR fetching (via GitHub Packages API)
- [ ] 1.6 Add error handling and "N/A" fallback for all sources
- [ ] 1.7 Test partial with various app types (GitHub, GitLab, Docker, no-repo)

## 2. Integrate into App Card
- [ ] 2.1 Update `layouts/partials/app-card.html` to call `last-updated` partial
- [ ] 2.2 Add `data-last-updated` attribute to app card div for sorting
- [ ] 2.3 Add `data-name` attribute to app card div for name sorting (if not present)
- [ ] 2.4 Add date display element in app metadata section with clock icon
- [ ] 2.5 Style the date display (muted, small font, consistent with other metadata)

## 3. Add Sort Functionality
- [ ] 3.1 Add "Sort by:" dropdown to filter panel in `layouts/apps/list.html`
- [ ] 3.2 Update `static/js/app-filters.js` with sort state management
- [ ] 3.3 Implement `sortCards()` function (by name ascending, by date descending)
- [ ] 3.4 Handle "N/A" entries (empty `data-last-updated`) sorting to end
- [ ] 3.5 Add URL state persistence for sort option (`?sort=name` or `?sort=updated`)
- [ ] 3.6 Apply sort from URL on page load

## 4. Styling
- [ ] 4.1 Add styles for sort dropdown in `assets/scss/_app-filters.scss`
- [ ] 4.2 Add styles for date display in `assets/scss/_styles_project.scss`
- [ ] 4.3 Ensure dark mode compatibility for new elements
- [ ] 4.4 Test responsive layout (mobile/tablet/desktop)

## 5. Testing & Validation
- [ ] 5.1 Test with GitHub repo app (e.g., feishin)
- [ ] 5.2 Test with GitLab repo app (ultrasonic)
- [ ] 5.3 Test with Docker Hub app (airsonic-refix)
- [ ] 5.4 Test with app having no repo/store (symfonium → N/A)
- [ ] 5.5 Test sort functionality with mixed dates and N/A values
- [ ] 5.6 Test URL state persistence for sort
- [ ] 5.7 Run local build and verify no errors
- [ ] 5.8 Check build time impact
