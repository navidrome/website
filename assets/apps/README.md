# Client Apps Directory

This directory contains information about client applications compatible with Navidrome.

## Contributing a New App

To add your app to the listing:

1. **Create a folder** for your app in this directory (`assets/apps/`) using a kebab-case identifier (e.g., `my-awesome-app`)

2. **Add an `index.yaml` file** with your app's information. Use [`_template/index.yaml`](./_template/index.yaml) as a reference.

3. **Add screenshots** to the same folder:
   - `thumbnail.png` (required) - Max 400x400px
   - Additional gallery images (optional) - Max 1200x1200px each
   - Formats: WebP preferred, PNG or JPEG acceptable (will be converted to WebP in the next step)

4. **Process your images** (required if your image formats or sizes don't meet guidelines):
   ```bash
   ./convert-app-images.sh <your-app-name>
   ```
   This will automatically convert and optimize your images to WebP format with max 1200px dimension. You'll need cwebp installed for this script to work. Install it via your package manager (e.g., `brew install webp` on macOS).

5. **Validate your app** (optional but recommended):
   ```bash
   npm install  # Install dependencies first
   npm run validate:app <your-app-name>
   ```

6. **Submit a Pull Request** with your new app folder

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

- **Thumbnail**: 1200x1200px max, square aspect ratio preferred
- **Gallery images**: 1200x1200px max, any aspect ratio
- **Formats**: WebP only
- **File size**: Keep under 500KB per image when possible

**Note**: Please run `./convert-app-images.sh <your-app-name>` on your app entry before submitting. This will automatically convert your images to WebP format, resize them to max 1200px, and optimize file sizes.

## Validating Your App Entry

Before submitting your PR, you can validate your app entry to catch common issues:

```bash
npm install  # Install dependencies (first time only)
npm run validate:app your-app-name
```

The validation script checks:
- ✅ YAML syntax and structure
- ✅ Required fields are present and valid
- ✅ APIs are correctly specified (OpenSubsonic, Subsonic, Navidrome)
- ✅ Image files exist in the app folder
- ✅ URLs are valid and reachable
- ✅ File sizes (warns if images > 500KB)

Example output:
```bash
$ npm run validate:app feishin

Validating app: feishin

Checking URLs (this may take a moment)...

⚠️  Found 2 warning(s):
  1. Gallery image screen2.png is 644KB (recommended: < 500KB)
```

**Note:** URL checks may timeout on slow connections - these are warnings, not errors.

## Questions?

If you have questions about adding your app, please [open an issue](https://github.com/navidrome/website/issues).
