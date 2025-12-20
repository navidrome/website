## Context

The Navidrome website needs a page to showcase compatible client apps. App developers will contribute their apps via GitHub PRs, adding a YAML file to the `apps/` directory. The site will render these into a responsive grid of cards.

### Stakeholders
- End users looking for compatible apps
- App developers wanting to list their apps
- Navidrome maintainers reviewing app submissions

## Goals / Non-Goals

### Goals
- Simple contribution workflow (single YAML file + screenshots)
- Responsive grid layout (mobile and desktop)
- Alphabetically sorted app list
- Thumbnail-click opens screenshot gallery
- Clear visual indicators for platforms and open source status

### Non-Goals
- Filtering/search (implemented in separate change: `add-apps-filtering-search`)
- User ratings or reviews
- Automated app validation
- Multiple languages (English only for now)

## Decisions

### Data Format: App subfolders in `apps/` directory
**Why**: 
- Each app gets its own folder (`apps/{app-id}/`) with `index.yaml` + screenshots
- Hugo can load YAML data files easily via `resources.Match`
- Easy for contributors to create/edit
- Git-friendly for PR reviews
- Self-contained: all app assets in one place, easier to add/remove apps

**Alternatives considered**:
- Single JSON/YAML file with all apps → Harder to review PRs, merge conflicts
- Hugo data directory (`data/apps/`) → Works but `apps/` at root is more discoverable
- Separate `apps/*.yaml` + `static/screenshots/{app-id}/` → Assets split across directories

### App Data Schema (Simplified from template)
```yaml
# File: apps/{app-id}/index.yaml
name: App Name          # Required: Display name
url: https://...        # Required: App homepage
platforms:              # Required: At least one platform
  android:
    store: https://...  # Optional: Store URL
  ios:
    store: https://...
  windows: true         # Or just boolean for platforms without stores
  linux: true
  macos: true
  web: true
apis:                   # Required: Supported APIs
  - opensubsonic
  - navidrome           # If app has Navidrome-specific features
description: "..."      # Required: Short description (1-2 sentences)
screenshots:
  thumbnail: thumbnail.png    # Required: Relative to app folder
  gallery:                    # Optional: Additional screenshots
    - screen1.png
    - screen2.png
repoUrl: https://...    # Optional: Makes OSS badge appear
```

Note: The `id` is derived from the folder name, no need to specify it in the YAML.

### Screenshot Storage
- Location: `apps/{app-id}/` (same folder as `index.yaml`)
- Thumbnail: Max 400x400px, required (e.g., `thumbnail.png`)
- Gallery images: Max 1000x1000px, optional (e.g., `screen1.png`, `screen2.png`)
- Formats: PNG or WebP preferred

**Example folder structure:**
```
apps/
  symfonium/
    index.yaml
    thumbnail.png
    screen1.png
    screen2.png
  dsub/
    index.yaml
    thumbnail.png
```

### Layout Architecture
```
layouts/
  apps/
    list.html          # Main page layout
  partials/
    app-card.html      # Individual app card
    app-gallery.html   # Lightbox modal
```

### Responsive Grid
- Desktop (>992px): 4 columns
- Tablet (768-992px): 3 columns  
- Mobile (576-768px): 2 columns
- Small mobile (<576px): 1 column

Using CSS Grid for simplicity and Bootstrap breakpoints for consistency with Docsy.

### Lightbox Gallery
Using vanilla JS with a simple modal approach:
- No external dependencies (keeps bundle small)
- Click thumbnail → opens modal with larger image
- If multiple screenshots, show prev/next navigation
- Click outside or ESC to close

### Platform Icons
Using Font Awesome icons (already included in Docsy):
- Android: `fab fa-android`
- iOS: `fab fa-apple`
- Windows: `fab fa-windows`
- Linux: `fab fa-linux`
- macOS: `fab fa-apple` (same as iOS, context makes it clear)
- Web: `fas fa-globe`

### Open Source Indicator
- If `repoUrl` is present, show a small GitHub icon/badge linking to repo
- Subtle, not prominent

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Screenshot size bloat | Document max sizes, add CI check later |
| Spam/low-quality submissions | PR review process, clear guidelines |
| Outdated app info | Add `lastUpdated` field, periodic reviews |

## Open Questions

- ~~Should we show API compatibility badges (OpenSubsonic/Navidrome)?~~ Yes, as small badges
- Should store links open in new tab? → Yes, external links should
