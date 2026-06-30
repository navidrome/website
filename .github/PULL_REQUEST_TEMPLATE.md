<!--
Thanks for contributing to the Navidrome website! 🎉
-->

## Description

<!-- What does this PR change, and why? -->

## Type of change

- [ ] App catalog entry (new app or update) — fill in the section below
- [ ] Documentation
- [ ] Bug fix
- [ ] Styling / layout
- [ ] Other

## Checklist

- [ ] Internal links use Hugo's `relref` shortcode
- [ ] I previewed my changes locally (`npm start`) when relevant
- [ ] The build passes (`npm run build`)

<!-- ⬇️ Only fill in the section below if this PR adds or updates an app. Otherwise, delete it. -->

<details>
<summary>📱 Adding or updating an app in the catalog?</summary>

Guide: https://www.navidrome.org/docs/developers/adding-apps/

- [ ] App supports the **OpenSubsonic**, **Subsonic**, or **Navidrome** API
- [ ] Folder under `assets/apps/` uses **kebab-case** (e.g. `my-awesome-app`)
- [ ] `index.yaml` has all required fields: `name`, `url`, `platforms`, `api`, `description`, `screenshots.thumbnail`
- [ ] Thumbnail is a **real screenshot of the app** (not a logo or icon)
- [ ] Images are **WebP**, max **1200px**, under **500KB** each (`npm run convert:images <app-name>`)
- [ ] `npm run validate:app <app-name>` passes
- [ ] I'm the app's author/maintainer, or have permission to submit it

</details>
