# Change: Add Client Apps Page

## Why
Users need to discover compatible music player apps for Navidrome. Currently there's no central listing of apps that support OpenSubsonic API. App developers should be able to contribute their apps via PRs using a simple folder structure.

## What Changes
- New top-level page at `/apps` displaying a responsive grid of client applications
- New data-driven architecture using app subfolders in `apps/{app-id}/` directory (each with `index.yaml` + screenshots)
- New Hugo layout for rendering app cards with thumbnails
- Thumbnail click opens a lightbox gallery showing app screenshots
- Navigation menu updated to include "Apps" link (between Demo and Documentation)
- Contribution template for app developers to submit new apps

## Impact
- Affected specs: None (new capability)
- Affected code:
  - `apps/{app-id}/index.yaml` - App data files (one folder per app)
  - `apps/{app-id}/*.png` - App screenshots (in same folder)
  - `content/en/apps/_index.md` - Page content
  - `layouts/apps/list.html` - Custom list template
  - `layouts/partials/app-card.html` - App card partial
  - `assets/scss/_styles_project.scss` - App grid styles
  - `assets/js/app-gallery.js` - Lightbox gallery JS
