# Project Context

## Purpose
This is the official website for **Navidrome**, an open-source personal music streaming server. The website serves as the primary source of information about the Navidrome project, providing:
- Comprehensive documentation for installation and configuration
- User guides and FAQ
- Developer documentation
- News and announcements
- Community resources and links

The site is hosted at https://www.navidrome.org

## Tech Stack

### Core Technologies
- **Hugo** (v0.152.2 extended) - Static site generator
- **Docsy** - Google's documentation theme for Hugo
- **Node.js** - Frontend tooling and build dependencies
- **Go** (v1.21.4) - Required by Hugo modules

### Build & Styling
- **PostCSS** / **Autoprefixer** - CSS processing
- **SCSS** - Custom styles in `assets/scss/`
- **rtlcss** - RTL language support

### Infrastructure
- **Netlify** - Hosting and continuous deployment
- **Docker** / **Docker Compose** - Local development environment
- **Google Analytics** - Site analytics (ID: G-CHTWP8NRKH)

### Development Commands
```bash
npm start           # Run local dev server via Docker Compose (http://localhost:1313)
npm run build       # Build site via Docker Compose
docker compose up   # Same as npm start
```

## Project Conventions

### Code Style
- **SCSS**: Use `_styles_project.scss` for custom component styles, `_variables_project.scss` for theme variable overrides
- **Hugo Templates**: Follow Docsy conventions for layouts and partials
- **Shortcodes**: Place custom shortcodes in `layouts/shortcodes/`
- **Markdown**: Use Hugo front matter with YAML or TOML (`+++` or `---`)

### Directory Structure
```
content/en/           # All English content (docs, about, community, etc.)
layouts/              # Hugo layout overrides and custom templates
  partials/           # Reusable template components
  shortcodes/         # Custom Hugo shortcodes
assets/               # SCSS, JS, icons (processed by Hugo Pipes)
static/               # Static assets served as-is (images, fonts, favicons)
themes/docsy/         # Docsy theme (managed as Hugo module)
```

### Content Organization
- Documentation lives in `content/en/docs/` with subdirectories for each section
- Use Hugo's `_index.md` for section landing pages
- Images go in `static/images/` or `static/screenshots/`
- Keep documentation modular and cross-linked with `relref` shortcodes

### Architecture Patterns
- **Theme Composition**: Docsy theme with project-specific overrides in `layouts/` and `assets/`
- **Hugo Modules**: Dependencies managed via `go.mod`
- **Partial Overrides**: Override Docsy partials by placing same-named files in `layouts/partials/`

### Git Workflow
- **Default Branch**: `master`
- **Deployment**: Automatic via Netlify on push to `master`
- **Repository**: https://github.com/navidrome/website

## Domain Context

### Navidrome Application
Navidrome is a personal music streaming server written in Go with a React frontend. Key concepts:
- **Subsonic API**: Navidrome implements the Subsonic API for mobile client compatibility
- **Multi-library support**: Users can organize music into separate libraries
- **Transcoding**: On-the-fly audio conversion for bandwidth management
- **Self-hosted**: Designed for personal/home server deployment

### Related Projects
- **Main Application**: https://github.com/navidrome/navidrome
- **Compatible Clients**: iOS and Android apps using Subsonic API (DSub, play:Sub, Symfonium, etc.)

### Audience
- End users wanting to set up their own music streaming server
- Developers contributing to Navidrome
- System administrators deploying Navidrome

## Important Constraints

- **Hugo Extended Required**: The site uses SCSS which requires Hugo Extended version
- **Docsy Theme**: Must maintain compatibility with Docsy theme conventions
- **Netlify Build**: Build must complete within Netlify's build limits
- **Open Source**: All content is GPL v3 licensed, consistent with Navidrome itself

## External Dependencies

- **Netlify**: Hosting and CD (deploy status badge in README)
- **GitHub**: Source repository and issue tracking
- **Google Analytics**: Usage tracking (optional, can be disabled)
- **Charts API**: External API fetched during build via `fetch-charts.sh`
- **POEditor**: Translation management (referenced in shortcodes)
- **Discord/Reddit**: Community channels linked from site
