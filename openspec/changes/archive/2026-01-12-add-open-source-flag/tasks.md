# Tasks

## 1. Schema & Data Updates
- [x] Add `isOpenSource` boolean field to `assets/apps/app-schema.json`
- [x] Add `isOpenSource: false` to `assets/apps/amcfy/index.yaml`
- [x] Add `isOpenSource: false` to `assets/apps/musiver/index.yaml`

## 2. Template Updates
- [x] Update `layouts/apps/list.html` to compute `data-oss` attribute based on `repoUrl` AND `isOpenSource !== false`
- [x] Update `layouts/partials/app-card.html` to show OSS badge only when `repoUrl` exists AND `isOpenSource !== false`

## 3. Documentation Updates
- [x] Update `content/en/docs/developers/adding-apps.md` to document the `isOpenSource` field and when to use it

## 4. Skill Updates
- [x] Update `.github/skills/app-entry-creator/SKILL.md` with guidance on determining if an app is open source vs just having a GitHub presence

## 5. Validation
- [x] Run `npm run validate:app amcfy` to verify schema accepts new field
- [x] Run `npm run validate:app musiver` to verify schema accepts new field
- [x] Test locally: verify Amcfy/Musiver no longer appear when "Open Source Only" filter is selected
- [x] Test locally: verify OSS badge is not shown on Amcfy/Musiver cards
