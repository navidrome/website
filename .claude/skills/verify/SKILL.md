---
name: verify
description: Run the Navidrome website locally and check a change in a real browser. Use to verify layout, shortcode, content, or apps-catalog changes.
---

# Verify a website change

## Start the site

Hugo is usually not installed on the host. Use Docker:

```bash
docker compose up -d
for i in $(seq 1 60); do curl -sf -o /dev/null http://localhost:1313/apps/ && echo UP && break; sleep 3; done
```

The first build takes about 40 seconds. Stop it after with `docker compose down`.

## Drive it

Use Playwright on `http://localhost:1313/`.

Apps catalog (`/apps/`):
- Every card is `.app-card`. Filtered-out cards get `.app-card--hidden`.
- Card data attributes: `data-free`, `data-oss`, `data-platforms`, `data-apis`, `data-name`.
- Pricing badge: `.app-pricing-pill--<pricing>` (no pill for `free`).
- Filters come from URL params: `free=true`, `oss=true`, `platform=a,b`, `api=a,b`, `q=<search>`, `sort=<key>`.
- The "Free Only" checkbox is `#filter-free`.

To screenshot one card, search for it (`?q=<name>`) and target `.app-card:not(.app-card--hidden)`.

## Gotchas

- Playwright writes `.playwright-mcp/` and screenshots into the repo root. Delete them after.
- The search box is `#app-search`. A second text input exists on the page (site search).
