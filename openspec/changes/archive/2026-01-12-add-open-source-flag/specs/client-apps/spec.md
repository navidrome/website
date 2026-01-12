# client-apps Spec Delta

## MODIFIED Requirements

### Requirement: App Card Display

Each app card SHALL display essential information about the client application.

#### Scenario: Open source indicator
- **WHEN** an app has a `repoUrl` defined
- **AND** the app has `isOpenSource` not set or set to `true`
- **THEN** the card displays a GitHub icon linking to the repository
- **AND** the app is considered open source for filtering purposes

#### Scenario: Repository without open source status
- **WHEN** an app has a `repoUrl` defined
- **AND** the app has `isOpenSource` set to `false`
- **THEN** the card does NOT display the GitHub/OSS icon
- **AND** the app is NOT considered open source for filtering purposes

---

### Requirement: App Data Contribution

App developers SHALL be able to contribute their apps via YAML files.

#### Scenario: Optional app fields
- **WHEN** an app YAML file is created
- **THEN** it MAY include: `repoUrl`, `isOpenSource`, `isFree`, `screenshots.gallery`, `keywords`, platform store URLs

#### Scenario: Closed-source app with repository
- **WHEN** an app has a GitHub/GitLab repository for releases or issue tracking
- **AND** the source code is not publicly available under an open source license
- **THEN** the entry SHOULD set `isOpenSource: false`
- **AND** the `repoUrl` MAY still be included for release date tracking
