# Tasks: Reorganize Documentation Navigation

## 1. Preparation

- [x] 1.1 Create backup branch or ensure clean git state
- [x] 1.2 Document current URL structure for verification

## 2. Create Sub-section Structure

- [x] 2.1 Create `usage/configuration/` directory with `_index.md`
- [x] 2.2 Create `usage/features/` directory with `_index.md`
- [x] 2.3 Create `usage/library/` directory with `_index.md`
- [x] 2.4 Create `usage/integration/` directory with `_index.md`
- [x] 2.5 Create `usage/admin/` directory with `_index.md`

## 3. Move and Rename Pages

### 3.1 Configuration Section
- [x] Move `configuration-options.md` → `configuration/options.md`, add alias `/docs/usage/configuration-options/`
- [x] Move `customtags.md` → `configuration/custom-tags.md`, add alias `/docs/usage/customtags/`
- [x] Move `pids.md` → `configuration/persistent-ids.md`, add alias `/docs/usage/pids/`
- [x] Move `getting-started/insights/` → `usage/configuration/insights/`, add alias `/docs/getting-started/insights/`
- [x] Move `getting-started/extauth-quickstart.md` → `configuration/extauth-quickstart.md`, add alias `/docs/getting-started/extauth-quickstart/`
- [x] Move `externalized-authentication.md` → `configuration/authentication.md`, add alias `/docs/usage/externalized-authentication/`

### 3.2 Features Section
- [x] Move `smartplaylists/` → `features/smart-playlists/`, add alias `/docs/usage/smartplaylists/`
- [x] Move `multi-library.md` → `features/multi-library.md`, add alias `/docs/usage/multi-library/`
- [x] Move `jukebox.md` → `features/jukebox.md`, add alias `/docs/usage/jukebox/`
- [x] Move `sharing.md` → `features/sharing.md`, add alias `/docs/usage/sharing/`
- [x] Move `scrobbling.md` → `features/scrobbling.md`, add alias `/docs/usage/scrobbling/`

### 3.3 Library Section
- [x] Move `artwork.md` → `library/artwork.md`, add alias `/docs/usage/artwork/`
- [x] Move `tagging-guidelines/` → `library/tagging/`, add alias `/docs/usage/tagging-guidelines/`
- [x] Move `missing-files/` → `library/missing-files/`, preserve alias if any
- [x] Move `ndignore.md` → `library/exclude-content.md`, add alias `/docs/usage/ndignore/`

### 3.4 Integration Section
- [x] Move `external-integrations.md` → `integration/external-services.md`, add aliases `/docs/usage/external-integrations/` and `/docs/usage/external_integrations/`
- [x] Move `monitoring.md` → `integration/monitoring.md`, add alias `/docs/usage/monitoring/`

### 3.5 Admin Section
- [x] Move `backup.md` → `admin/backup.md`, add alias `/docs/usage/backup/`
- [x] Move `security.md` → `admin/security.md`, add alias `/docs/usage/security/`

### 3.6 Cleanup
- [x] Delete `troubleshooting.md` (marked as draft, never published)

## 4. Update Internal References

- [x] 4.1 Update links in `content/en/docs/faq/_index.md` (~10 links)
- [x] 4.2 Update links in `content/en/docs/usage/` pages (cross-references)
- [x] 4.3 Update links in `content/en/docs/installation/` pages
- [x] 4.4 Update links in `content/en/docs/getting-started/` pages
- [x] 4.5 Update links in `content/en/docs/developers/` pages
- [x] 4.6 Update links in `content/en/docs/overview/` page
- [x] 4.7 Update links in `content/en/_index.md` (homepage)
- [x] 4.8 Update links in `content/en/demo/_index.md` (no links to update)
- [x] 4.9 Update links in `content/en/about/_index.md` (no links to update)
- [x] 4.10 Update reference-style links at bottom of files (e.g., `[config]: /docs/usage/...`)

## 5. Validation

- [x] 5.1 Run Hugo build locally (`hugo`)
- [x] 5.2 Check for broken links in build output
- [x] 5.3 Verify aliases generate redirect pages (24 aliases created)
- [x] 5.4 Test navigation menu structure locally (`npm start`)
- [x] 5.5 Manually verify old URLs redirect to new locations
- [x] 5.6 Check canonical URLs in generated HTML

## 6. Documentation

- [x] 6.1 Update any README or contributing guides if they reference doc structure (none found)
- [x] 6.2 Consider adding a note about URL changes to release notes

## Dependencies

- Tasks 3.x depend on 2.x (directories must exist)
- Task 4.x can run in parallel after 3.x completes
- Task 5.x requires all previous tasks complete

## Parallelizable Work

- 2.1–2.5 can run in parallel
- 3.1–3.6 can run in parallel
- 4.1–4.10 can run in parallel after step 3 completes
