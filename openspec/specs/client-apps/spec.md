# client-apps Specification

## Purpose
TBD - created by archiving change add-client-apps-page. Update Purpose after archive.
## Requirements
### Requirement: Client Apps Page
The website SHALL provide a top-level page at `/apps` that displays all compatible client applications.

#### Scenario: User visits apps page
- **WHEN** a user navigates to `/apps`
- **THEN** the page displays a grid of app cards sorted alphabetically by app name
- **AND** each card shows the app thumbnail, name, and platform icons

#### Scenario: Apps page is accessible from navigation
- **WHEN** a user views the main navigation menu
- **THEN** an "Apps" link is visible between "Demo" and "Documentation"
- **AND** clicking it navigates to `/apps`

---

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

### Requirement: Screenshot Gallery
The page SHALL provide a lightbox gallery for viewing app screenshots.

#### Scenario: Opening gallery from thumbnail
- **WHEN** a user clicks on an app thumbnail
- **THEN** a modal opens displaying the thumbnail at larger size
- **AND** if the app has additional screenshots in the gallery, navigation controls are shown

#### Scenario: Gallery navigation
- **WHEN** a user is viewing a gallery with multiple screenshots
- **THEN** they can navigate between screenshots using prev/next controls
- **AND** they can close the modal by clicking outside it or pressing Escape

---

### Requirement: Responsive Layout
The apps grid SHALL adapt to different screen sizes.

#### Scenario: Desktop layout
- **WHEN** the viewport width is greater than 992px
- **THEN** the grid displays 4 app cards per row

#### Scenario: Tablet layout
- **WHEN** the viewport width is between 768px and 992px
- **THEN** the grid displays 3 app cards per row

#### Scenario: Mobile layout
- **WHEN** the viewport width is between 576px and 768px
- **THEN** the grid displays 2 app cards per row

#### Scenario: Small mobile layout
- **WHEN** the viewport width is less than 576px
- **THEN** the grid displays 1 app card per row

---

### Requirement: App Data Contribution
App developers SHALL be able to contribute their apps via YAML files.

#### Scenario: Adding a new app
- **WHEN** a developer wants to add their app to the listing
- **THEN** they create a folder `apps/{app-id}/` with an `index.yaml` file following the template
- **AND** they add screenshots to the same folder (thumbnail + optional gallery images)
- **AND** they submit a pull request for review

#### Scenario: Required app fields
- **WHEN** an app YAML file is created
- **THEN** it MUST include: `name`, `url`, `platforms` (at least one), `apis` (at least one: `opensubsonic` or `navidrome`), `description`, and `screenshots.thumbnail`
- **AND** the app `id` is derived from the folder name

#### Scenario: Optional app fields
- **WHEN** an app YAML file is created
- **THEN** it MAY include: `repoUrl`, `screenshots.gallery`, platform store URLs

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

