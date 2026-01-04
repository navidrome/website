# documentation-navigation Specification

## Purpose
TBD - created by archiving change reorganize-docs-navigation. Update Purpose after archive.
## Requirements
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

### Requirement: Getting Started Content

The Getting Started page SHALL provide a foolproof guide for new users to complete their first successful session with Navidrome.

The page SHALL be organized into sequential numbered steps that guide users from installation completion to playing their first song.

The page SHALL include verification steps that allow users to confirm each stage is working correctly before proceeding.

The page SHALL provide troubleshooting guidance for common issues without requiring users to seek external help for basic problems.

#### Scenario: New user with successful installation
- **WHEN** a new user visits the Getting Started page after installation
- **THEN** they see a pre-flight checklist to verify installation is complete
- **AND** they can follow numbered steps to create their first admin user
- **AND** they see clear timing expectations for when music will appear
- **AND** they know what visual indicators show success at each step

#### Scenario: User encounters music not appearing
- **WHEN** a user's music doesn't appear within expected timeframe
- **THEN** the page provides actionable troubleshooting steps
- **AND** includes instructions to check logs for scan progress
- **AND** includes common permission issues and how to resolve them
- **AND** does not require the user to "reach out" as the primary solution

#### Scenario: User has platform-specific issues
- **WHEN** a user encounters platform-specific issues
- **THEN** the page provides platform-specific tips in collapsible sections
- **AND** covers common issues for Docker, Linux, Windows, and macOS

