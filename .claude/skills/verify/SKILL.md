---
name: verify
description: Run the Navidrome website locally and check a change in a real browser. Use to verify layout, shortcode, content, or apps-catalog changes.
---

# Verify a website change

## Start the site

Hugo is usually not installed on the host. Use Docker:

```bash
docker compose up -d
for i in $(seq 1 60); do
  curl -sf -m 3 -o /dev/null http://localhost:1313/apps/ && echo UP && break
  [ -z "$(docker compose ps -q site)" ] && echo "CONTAINER EXITED" && break
  sleep 3
done
```

The first build takes about 40 seconds. Stop it after with `docker compose down`.

The loop checks that the container still runs. Without that check, a server that exits makes the
loop wait until the tool times out. If it prints `CONTAINER EXITED`, read the errors with
`docker compose logs --no-log-prefix | grep ^ERROR`.

## Check the build without a server

To only check for build errors, build once. It exits non-zero on failure and can't hang:

```bash
docker compose run --rm -T --no-deps --entrypoint sh site -c "hugo build -d /tmp/out"
```

## Open it from another machine

`docker compose up` links pages to `localhost`, so other machines get broken links. Stop it, then
start a server with this Mac's LAN IP as the base URL:

```bash
docker compose down
IP=$(ipconfig getifaddr en0)
docker compose run -d --rm --service-ports --name website-lan --entrypoint sh site \
  -c "./fetch-charts.sh; hugo server --bind 0.0.0.0 --baseURL http://$IP:1313/"
```

Open `http://<IP>:1313/`. Stop it with `docker stop website-lan`. If the other machine can't
connect, the macOS firewall may be blocking Docker.

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

- `docker-compose.yaml` sets `HUGO_ENABLEGITINFO=false`. A Git worktree keeps its `.git` data
  outside the mounted folder, and with Git info on, Hugo logs `Failed to read Git log` and the
  server exits. Keep that setting when you run Hugo in Docker another way. Local pages show no
  "last updated" dates because of it.
- The build log has many `WARN [last-updated]` lines where GitHub answers `Forbidden`. They are
  warnings from the apps catalog, and the build still works.
- Playwright writes `.playwright-mcp/` and screenshots into the repo root. Delete them after.
- The search box is `#app-search`. A second text input exists on the page (site search).
