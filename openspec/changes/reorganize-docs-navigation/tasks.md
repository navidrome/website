# Tasks: Reorganize Documentation Navigation

## 1. Preparation

- [ ] 1.1 Create backup branch or ensure clean git state
- [ ] 1.2 Document current URL structure for verification

## 2. Create Sub-section Structure

- [ ] 2.1 Create `usage/configuration/` directory with `_index.md`
- [ ] 2.2 Create `usage/features/` directory with `_index.md`
- [ ] 2.3 Create `usage/library/` directory with `_index.md`
- [ ] 2.4 Create `usage/integration/` directory with `_index.md`
- [ ] 2.5 Create `usage/admin/` directory with `_index.md`

## 3. Move and Rename Pages

### 3.1 Configuration Section
- [ ] Move `configuration-options.md` → `configuration/options.md`, add alias `/docs/usage/configuration-options/`
- [ ] Move `customtags.md` → `configuration/custom-tags.md`, add alias `/docs/usage/customtags/`
- [ ] Move `pids.md` → `configuration/persistent-ids.md`, add alias `/docs/usage/pids/`
- [ ] Move `getting-started/insights/` → `usage/configuration/insights/`, add alias `/docs/getting-started/insights/`

### 3.2 Features Section
- [ ] Move `smartplaylists/` → `features/smart-playlists/`, add alias `/docs/usage/smartplaylists/`
- [ ] Move `multi-library.md` → `features/multi-library.md`, add alias `/docs/usage/multi-library/`
- [ ] Move `jukebox.md` → `features/jukebox.md`, add alias `/docs/usage/jukebox/`
- [ ] Move `sharing.md` → `features/sharing.md`, add alias `/docs/usage/sharing/`
- [ ] Move `scrobbling.md` → `features/scrobbling.md`, add alias `/docs/usage/scrobbling/`

### 3.3 Library Section
- [ ] Move `artwork.md` → `library/artwork.md`, add alias `/docs/usage/artwork/`
- [ ] Move `tagging-guidelines/` → `library/tagging/`, add alias `/docs/usage/tagging-guidelines/`
- [ ] Move `missing-files/` → `library/missing-files/`, preserve alias if any
- [ ] Move `ndignore.md` → `library/exclude-content.md`, add alias `/docs/usage/ndignore/`

### 3.4 Integration Section
- [ ] Move `external-integrations.md` → `integration/external-services.md`, add aliases `/docs/usage/external-integrations/` and `/docs/usage/external_integrations/`
- [ ] Move `externalized-authentication.md` → `integration/authentication.md`, add alias `/docs/usage/externalized-authentication/`
- [ ] Move `monitoring.md` → `integration/monitoring.md`, add alias `/docs/usage/monitoring/`

### 3.5 Admin Section
- [ ] Move `backup.md` → `admin/backup.md`, add alias `/docs/usage/backup/`
- [ ] Move `security.md` → `admin/security.md`, add alias `/docs/usage/security/`

### 3.6 Cleanup
- [ ] Delete `troubleshooting.md` (marked as draft, never published)

## 4. Update Internal References

- [ ] 4.1 Update links in `content/en/docs/faq/_index.md` (~10 links)
- [ ] 4.2 Update links in `content/en/docs/usage/` pages (cross-references)
- [ ] 4.3 Update links in `content/en/docs/installation/` pages
- [ ] 4.4 Update links in `content/en/docs/getting-started/` pages
- [ ] 4.5 Update links in `content/en/docs/developers/` pages
- [ ] 4.6 Update links in `content/en/docs/overview/` page
- [ ] 4.7 Update links in `content/en/_index.md` (homepage)
- [ ] 4.8 Update links in `content/en/demo/_index.md`
- [ ] 4.9 Update links in `content/en/about/_index.md`
- [ ] 4.10 Update reference-style links at bottom of files (e.g., `[config]: /docs/usage/...`)

## 5. Validation

- [ ] 5.1 Run Hugo build locally (`npm run build`)
- [ ] 5.2 Check for broken links in build output
- [ ] 5.3 Verify aliases generate redirect pages
- [ ] 5.4 Test navigation menu structure locally (`npm start`)
- [ ] 5.5 Manually verify old URLs redirect to new locations
- [ ] 5.6 Check canonical URLs in generated HTML

## 6. Documentation

- [ ] 6.1 Update any README or contributing guides if they reference doc structure
- [ ] 6.2 Consider adding a note about URL changes to release notes

## Dependencies

- Tasks 3.x depend on 2.x (directories must exist)
- Task 4.x can run in parallel after 3.x completes
- Task 5.x requires all previous tasks complete

## Parallelizable Work

- 2.1–2.5 can run in parallel
- 3.1–3.6 can run in parallel
- 4.1–4.10 can run in parallel after step 3 completes
