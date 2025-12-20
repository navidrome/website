## ADDED Requirements

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
- **AND** it displays platform icons for supported platforms (Android, iOS, Windows, Linux, macOS, Web)
- **AND** it displays a short description of the app

#### Scenario: Open source indicator
- **WHEN** an app has a `repoUrl` defined
- **THEN** the card displays a GitHub icon linking to the repository

#### Scenario: Store links
- **WHEN** an app has store URLs defined for platforms (Play Store, App Store)
- **THEN** clicking the platform icon navigates to the respective store page

---

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
