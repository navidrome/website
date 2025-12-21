# client-apps Spec Delta

## ADDED Requirements

### Requirement: App Last Updated Date Display
Each app card SHALL display the last release date of the application.

#### Scenario: App with GitHub repository
- **WHEN** an app has a `repoUrl` pointing to GitHub
- **THEN** the card displays the `published_at` date from the latest GitHub release
- **AND** the date is formatted as `YYYY-MM-DD`

#### Scenario: App with GitLab repository
- **WHEN** an app has a `repoUrl` pointing to GitLab
- **THEN** the card displays the `released_at` date from the latest GitLab release
- **AND** the date is formatted as `YYYY-MM-DD`

#### Scenario: App with Docker Hub store URL
- **WHEN** an app has `platforms.docker.store` pointing to Docker Hub
- **AND** the app does not have a `repoUrl`
- **THEN** the card displays the last tag push date from Docker Hub
- **AND** the date is formatted as `YYYY-MM-DD`

#### Scenario: App with GHCR store URL
- **WHEN** an app has `platforms.docker.store` pointing to ghcr.io
- **AND** the app does not have a `repoUrl`
- **THEN** the card displays the last package version date from GitHub Packages API
- **AND** the date is formatted as `YYYY-MM-DD`

#### Scenario: App with unsupported or missing source
- **WHEN** an app does not have a `repoUrl`
- **AND** the app does not have a supported store URL (Docker Hub, GHCR)
- **THEN** the card displays "N/A" for the last updated date

#### Scenario: API fetch failure
- **WHEN** fetching the release date fails (network error, rate limit, no releases)
- **THEN** the card displays "N/A" for the last updated date
- **AND** the build completes without error

---

### Requirement: Sort By Option
The apps page SHALL provide a sort option to order apps by name or last updated date.

#### Scenario: Default sort order
- **WHEN** a user visits `/apps` without sort parameters
- **THEN** apps are displayed sorted alphabetically by name (A-Z)

#### Scenario: Sort by last updated
- **WHEN** a user selects "Last Updated" from the sort dropdown
- **THEN** apps are re-ordered with most recently updated apps first
- **AND** apps with "N/A" dates appear at the end of the list

#### Scenario: Sort state in URL
- **WHEN** a user selects a sort option
- **THEN** the URL is updated to include the sort parameter (e.g., `?sort=updated`)
- **AND** refreshing the page preserves the selected sort order

#### Scenario: Sort combined with filters
- **WHEN** a user has active filters (platform, API, search)
- **AND** the user changes the sort order
- **THEN** only the visible (filtered) apps are re-ordered
- **AND** filter parameters are preserved in the URL alongside sort parameter

---

## MODIFIED Requirements

### Requirement: App Card Display
Each app card SHALL display essential information about the client application.

#### Scenario: App card content
- **WHEN** an app card is rendered
- **THEN** it displays the app thumbnail image
- **AND** it displays the app name as a link to the app URL
- **AND** it displays platform icons for supported platforms (Android, iOS, Windows, Linux, macOS, Web, Docker)
- **AND** it displays a short description of the app
- **AND** it displays the last updated date (or "N/A")

#### Scenario: Open source indicator
- **WHEN** an app has a `repoUrl` defined
- **THEN** the card displays a GitHub icon linking to the repository

#### Scenario: Store links
- **WHEN** an app has store URLs defined for platforms (Play Store, App Store)
- **THEN** clicking the platform icon navigates to the respective store page
