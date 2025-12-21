---
title: "Adding Client Apps to the Catalog"
linkTitle: "Adding Client Apps"
weight: 25
description: >
  How to add or update an app in the Compatible Client Apps catalog
---

Want to list your app in the [Compatible Client Apps](/apps/) catalog? This guide explains how to submit your app or update an existing entry.

## Prerequisites

- Your app must support the [OpenSubsonic](https://opensubsonic.netlify.app/), [Subsonic](https://subsonic.org/pages/api.jsp), or Navidrome API
- You'll need a GitHub account to submit a pull request
- Images should be in WebP, PNG, or JPEG format

## Quick Start

1. Fork the [navidrome/website](https://github.com/navidrome/website) repository
2. Create a folder for your app in `assets/apps/` using kebab-case (e.g., `my-awesome-app`)
3. Add an `index.yaml` file with your app's metadata
4. Add a thumbnail image and optional gallery screenshots
5. Submit a pull request

## Folder Structure

Each app has its own folder under `assets/apps/`:

```
assets/apps/
  my-app/
    index.yaml        # App metadata (required)
    thumbnail.webp    # App thumbnail (required)
    screen1.webp      # Gallery screenshot (optional)
    screen2.webp      # Gallery screenshot (optional)
```

## Creating index.yaml

Use the template at [`assets/apps/_template/index.yaml`](https://github.com/navidrome/website/blob/master/assets/apps/_template/index.yaml) as a starting point.

### Required Fields

| Field                   | Description                                               |
|-------------------------|-----------------------------------------------------------|
| `name`                  | Display name of your app                                  |
| `url`                   | Official app website or homepage                          |
| `platforms`             | At least one platform (see below)                         |
| `api`                   | Supported API: `OpenSubsonic`, `Subsonic`, or `Navidrome` |
| `description`           | Brief description (1-2 sentences)                         |
| `screenshots.thumbnail` | Filename of thumbnail image                               |

### Optional Fields

| Field                 | Description                                                 |
|-----------------------|-------------------------------------------------------------|
| `repoUrl`             | GitHub repository URL (displays an open source badge)       |
| `isFree`              | Whether the app is free (no purchase required) - boolean    |
| `keywords`            | Additional search terms (max 6) - not displayed on app card |
| `screenshots.gallery` | Array of additional screenshot filenames                    |
| `platforms.*.store`   | Platform-specific store URLs                                |

### Supported Platforms

- `android` - Google Play Store
- `ios` - Apple App Store  
- `macos` - macOS (optionally with Mac App Store link)
- `windows` - Windows
- `linux` - Linux
- `web` - Web browser
- `docker` - Docker container (optionally with Docker Hub link)
- `other` - CLI tools, other platforms

### Example index.yaml

```yaml
name: My Music App
url: https://example.com/my-app
repoUrl: https://github.com/example/my-app  # Optional - shows OSS badge

platforms:
  android:
    store: https://play.google.com/store/apps/details?id=com.example.myapp
  ios:
    store: https://apps.apple.com/app/my-app/id123456789
  web: true
  linux: true

api: OpenSubsonic

description: A beautiful music player with offline support and gapless playback.

screenshots:
  thumbnail: thumbnail.webp
  gallery:
    - screen1.webp
    - screen2.webp

keywords:
  - dlna
  - chromecast
  - carplay
  - android auto
```

## Image Guidelines

### Thumbnail (Required)

- **Max size**: 1200×1200px
- **Aspect ratio**: Square preferred
- **Format**: WebP (PNG/JPEG will be converted)

### Gallery Images (Optional)

- **Max size**: 1200×1200px
- **Aspect ratio**: Any
- **Format**: WebP (PNG/JPEG will be converted)
- **File size**: Keep under 500KB per image

### Processing Images

If your images don't meet the guidelines, run the conversion script:

```bash
npm run convert:images my-app
```

This automatically converts images to WebP format, resizes them to max 1200px, and optimizes file sizes.

## Validating Your Entry

Before submitting, validate your app entry:

```bash
npm run validate:app my-app
```

The validation checks:
- YAML syntax and structure
- Required fields are present
- APIs are correctly specified
- Image files exist
- URLs are valid and reachable
- File sizes (warns if images > 500KB)

## Updating an Existing App

To update an existing app entry:

1. Find the app folder in `assets/apps/`
2. Modify the `index.yaml` or replace images as needed
3. Run validation and submit a pull request

## Questions?

If you have questions about adding your app, please [open an issue](https://github.com/navidrome/website/issues) on GitHub.
