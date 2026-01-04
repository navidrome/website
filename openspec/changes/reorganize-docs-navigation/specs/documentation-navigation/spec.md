# documentation-navigation Specification Delta

## ADDED Requirements

### Requirement: Hierarchical Usage Section
The documentation SHALL organize usage content into logical sub-sections with collapsible navigation.

#### Scenario: Sub-sections visible in navigation
- **WHEN** a user views the documentation left navigation
- **THEN** the "Usage" section displays collapsible sub-sections
- **AND** sub-sections include: Configuration, Features, Library, Integration, Admin
- **AND** each sub-section groups related documentation pages

#### Scenario: Configuration sub-section
- **WHEN** a user expands the "Configuration" sub-section
- **THEN** they see pages for: Configuration Options, Custom Tags, Persistent IDs
- **AND** pages are ordered logically (options first)

#### Scenario: Features sub-section
- **WHEN** a user expands the "Features" sub-section
- **THEN** they see pages for: Smart Playlists, Multi-Library, Jukebox, Sharing, Scrobbling
- **AND** pages describe Navidrome feature capabilities

---

### Requirement: URL Redirects for Moved Pages
The website SHALL provide redirects from old URLs to new URLs for all reorganized pages.

#### Scenario: Old configuration-options URL redirects
- **WHEN** a user visits `/docs/usage/configuration-options/`
- **THEN** they are redirected to `/docs/usage/configuration/options/`
- **AND** a canonical link points to the new URL
- **AND** the redirect is immediate (no user action required)

#### Scenario: Old smartplaylists URL redirects
- **WHEN** a user visits `/docs/usage/smartplaylists/`
- **THEN** they are redirected to `/docs/usage/features/smart-playlists/`
- **AND** bookmarked links continue to work

#### Scenario: External integrations legacy alias preserved
- **WHEN** a user visits `/docs/usage/external_integrations/` (underscore variant)
- **THEN** they are redirected to the new `/docs/usage/integration/external-services/` URL
- **AND** the legacy underscore URL continues to work

#### Scenario: Insights page redirect from Getting Started
- **WHEN** a user visits `/docs/getting-started/insights/`
- **THEN** they are redirected to `/docs/usage/configuration/insights/`
- **AND** the page content remains unchanged

---

### Requirement: Consistent Internal References
All internal documentation links SHALL point to canonical (new) URLs.

#### Scenario: FAQ links use new URLs
- **WHEN** a documentation page in FAQ references configuration options
- **THEN** the link uses `/docs/usage/configuration/options/`
- **AND** the link does not use the old `/docs/usage/configuration-options/` path

#### Scenario: Cross-references between usage pages
- **WHEN** a page in the Features section links to a Configuration page
- **THEN** the link uses the new canonical URL path
- **AND** there are no broken internal links after build

---

## MODIFIED Requirements

### Requirement: Usage Section Structure
The Usage section SHALL be restructured from a flat list to a hierarchical organization.

#### Scenario: Before reorganization (previous behavior)
- **WHEN** a user viewed the Usage section navigation
- **THEN** all 18 pages appeared as a flat list under Usage
- **AND** finding specific content required scanning the entire list

#### Scenario: After reorganization (new behavior)
- **WHEN** a user views the Usage section navigation
- **THEN** pages are grouped into 5 logical sub-sections
- **AND** each sub-section can be expanded/collapsed
- **AND** users can quickly identify relevant content categories
