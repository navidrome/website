# apps-filtering Spec Delta

## MODIFIED Requirements

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
