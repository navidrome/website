# Client Apps Directory

This directory contains information about client applications compatible with Navidrome.

## Contributing a New App

To add your app to the listing:

1. **Create a folder** for your app in this directory (`assets/apps/`) using a kebab-case identifier (e.g., `my-awesome-app`)

2. **Add an `index.yaml` file** with your app's information. Use [`_template/index.yaml`](./_template/index.yaml) as a reference.

3. **Add screenshots** to the same folder:
   - `thumbnail.png` (required) - Max 400x400px
   - Additional gallery images (optional) - Max 1000x1000px each
   - Formats: PNG or WebP preferred

4. **Submit a Pull Request** with your new app folder

## App Folder Structure

```
assets/apps/
  my-app/
    index.yaml        # App metadata
    thumbnail.png     # Required: App thumbnail/icon
    screen1.png       # Optional: Gallery screenshot
    screen2.png       # Optional: Gallery screenshot
```

## Required Fields

Your `index.yaml` must include:

- `name` - Display name of your app
- `url` - Official app website or homepage
- `platforms` - At least one platform (android, ios, macos, windows, linux, web)
- `apis` - Supported APIs (`OpenSubsonic`, `Subsonic`, and/or `Navidrome`)
- `description` - Brief description (1-2 sentences)
- `screenshots.thumbnail` - Path to thumbnail image (relative to folder)

## Optional Fields

- `platforms.android.store` - Google Play Store URL
- `platforms.ios.store` - Apple App Store URL
- `platforms.macos.store` - Mac App Store URL (optional, set to `true` if no store link)
- `screenshots.gallery` - Array of additional screenshot paths
- `repoUrl` - GitHub repository URL (displays OSS badge)

## Screenshot Guidelines

- **Thumbnail**: 400x400px max, square aspect ratio preferred
- **Gallery images**: 1000x1000px max, any aspect ratio
- **Formats**: PNG or WebP recommended
- **File size**: Keep under 500KB per image when possible

## Questions?

If you have questions about adding your app, please [open an issue](https://github.com/navidrome/website/issues).
