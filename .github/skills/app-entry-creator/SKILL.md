---
name: app-entry-creator
description: Create Navidrome client app catalog entries from a URL. This skill should be used when the user provides a URL and wants to add an app to the Compatible Client Apps catalog. It automates discovering app metadata, downloading screenshots, and generating the index.yaml file.
---

# App Entry Creator

This skill creates complete app entries for the Navidrome Compatible Client Apps catalog by analyzing a provided URL and discovering all relevant information automatically.

## When to Use

Use this skill when:
- User provides a URL and wants to create a new app entry
- User mentions adding an app to the catalog
- User wants to create an entry in `assets/apps/`

## Workflow

### Step 1: Analyze the Provided URL

Determine the URL type and extract initial information:

| URL Type | What to Extract |
|----------|-----------------|
| GitHub repo | Name, description, README content, releases, screenshots from README |
| App website | Name, description, screenshots, links to stores |
| Play Store | App name, description, screenshots, developer website |
| App Store | App name, description, screenshots, developer website |
| Docker Hub | Image name, description, GitHub link |

### Step 2: Discover Related URLs

From the initial URL, find all related resources:

1. **From GitHub repos**: Look for:
   - Website URL (in repo description or README)
   - App store links (Play Store, App Store) in README
   - Docker images (in README or packages)
   - Screenshots in README or `/screenshots`, `/images`, `/docs` folders

2. **From app websites**: Look for:
   - GitHub/source repository link
   - App store badges/links
   - Docker installation instructions

3. **From app stores**: Look for:
   - Developer website
   - GitHub link in description

### Step 3: Determine API Support

Check documentation/README for mentions of:
- "OpenSubsonic" → `api: OpenSubsonic`
- "Subsonic API" or just "Subsonic" → `api: Subsonic`
- "Navidrome API" or Navidrome-specific features → `api: Navidrome`

Default to `Subsonic` if unclear but the app claims Subsonic compatibility.

### Step 4: Identify Platforms

Map discovered information to platforms:

| Evidence | Platform Config |
|----------|-----------------|
| Play Store URL | `android: { store: <url> }` |
| App Store URL (iPhone/iPad) | `ios: { store: <url> }` |
| Mac App Store URL | `macos: { store: <url> }` |
| macOS downloads/releases | `macos: true` |
| Windows downloads/releases | `windows: true` |
| Linux downloads/releases | `linux: true` |
| Web demo/hosted version | `web: { url: <url> }` or `web: true` |
| Docker image | `docker: { store: <url> }` or `docker: true` |
| CLI tool | `other: true` |

### Step 5: Download Screenshots

1. **Find screenshot sources** (in priority order):
   - App store listings (highest quality)
   - README screenshots
   - `/screenshots` or `/images` folder in repo
   - App website gallery

2. **Download images** using terminal commands:
   ```bash
   cd assets/apps/<app-name>
   curl -L -o thumbnail.png "<image-url>"
   curl -L -o screen1.png "<image-url>"
   ```

3. **Skip these image types**:
   - Small icons/logos (< 200px)
   - Badges (build status, download counts)
   - Diagrams/flowcharts
   - Social media preview images

4. **Run the conversion script**:
   ```bash
   npm run convert:images <app-name>
   ```

### Step 6: Create the App Entry

1. **Create the folder** using kebab-case:
   ```bash
   mkdir -p assets/apps/<app-name>
   ```

2. **Generate `index.yaml`** with all discovered information following the schema in `references/app-schema.json`

3. **Required fields** (must have values):
   - `name`: Display name
   - `url`: Official website or GitHub URL
   - `platforms`: At least one platform
   - `api`: One of `OpenSubsonic`, `Subsonic`, `Navidrome`
   - `description`: 1-2 sentences (max 500 chars)
   - `screenshots.thumbnail`: Filename of downloaded thumbnail

4. **Optional fields** (include if found):
   - `repoUrl`: GitHub URL (shows OSS badge)
   - `isFree`: Set to `true` if app is free
   - `screenshots.gallery`: Array of screenshot filenames (max 5)
   - `keywords`: Search terms not in name/description (max 6)

### Step 7: Validate the Entry

Run validation to ensure correctness:
```bash
npm run validate:app <app-name>
```

Fix any errors before presenting to user.

## Example Workflow

Given URL: `https://github.com/jeffvli/feishin`

1. **Fetch GitHub page** → Extract: name "Feishin", description, README
2. **Parse README** → Find: screenshots, Docker image, web demo URL
3. **Discover URLs**:
   - Website: https://feishin.vercel.app/ (from README)
   - Docker: ghcr.io/jeffvli/feishin (from README)
4. **Determine API**: README mentions "Navidrome" → `api: Navidrome`
5. **Identify platforms**: Windows, macOS, Linux (releases), Docker, Web
6. **Download screenshots** from README images
7. **Create entry**:
   ```
   assets/apps/feishin/
     index.yaml
     thumbnail.webp
     screen1.webp
     screen2.webp
   ```
8. **Validate**: `npm run validate:app feishin`

## Output Format

After completion, present:

1. Summary of discovered information
2. The generated `index.yaml` content
3. List of downloaded images
4. Validation results
5. Any manual steps needed (if images couldn't be found)

## References

- Schema: `apps/app-schema.json` - JSON Schema for validation
- Template: `apps/_template/index.yaml` - Example index.yaml structure
- Documentation: [Adding Client Apps](/content/en/docs/developers/adding-apps.md)

## Error Handling

| Issue | Action |
|-------|--------|
| No screenshots found | Warn user, create entry without gallery, thumbnail required |
| URL unreachable | Report error, ask for alternative URL |
| API type unclear | Default to `Subsonic`, note uncertainty |
| Multiple possible names | Use the most prominent/official name |
