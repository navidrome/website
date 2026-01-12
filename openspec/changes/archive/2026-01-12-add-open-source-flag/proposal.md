# Change: Add explicit isOpenSource flag for apps

## Why

Currently, the "Open Source Only" filter and OSS badge are triggered solely by the presence of a `repoUrl`. However, some apps (like Amcfy and Musiver) have GitHub repositories for releases and issue tracking, but **are not actually open source** — their source code is not publicly available.

This creates a false positive where users filtering for open-source apps see closed-source apps, and app cards display a misleading GitHub/OSS badge.

## What Changes

- Add a new optional `isOpenSource` boolean field to the app schema
- Update filter logic: an app is considered open source only if it has `repoUrl` AND `isOpenSource` is not explicitly `false`
- Update app cards: show OSS badge only for truly open-source apps
- Update documentation: explain the new field and when to use it
- Update app-entry-creator skill: add guidance for determining if an app is open source

## Impact

- Affected specs: `client-apps`, `apps-filtering`
- Affected code:
  - `assets/apps/app-schema.json` - add new field
  - `layouts/apps/list.html` - update data attributes
  - `layouts/partials/app-card.html` - update OSS badge logic
  - `assets/js/app-filters.js` - update filter logic (if needed)
  - `content/en/docs/developers/adding-apps.md` - document new field
  - `.github/skills/app-entry-creator/SKILL.md` - add OSS detection guidance
  - `assets/apps/amcfy/index.yaml` - add `isOpenSource: false`
  - `assets/apps/musiver/index.yaml` - add `isOpenSource: false`
