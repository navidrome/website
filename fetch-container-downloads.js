#!/usr/bin/env node

/**
 * Fetch Container Downloads Script
 *
 * Sums the downloads of the Navidrome container images and writes:
 *   static/badges/container-downloads.json         - Shields endpoint badge
 *   static/badges/container-downloads-details.json - exact counts and collection time
 *
 * Counts are only written when all sources answer. When one fails, the result
 * published on the website is written again, because each deploy replaces all
 * files and a build without them would remove the badge.
 *
 * Usage: npm run fetch:pulls
 *
 * In production (HUGO_ENV=production), the script fails if a source fails and
 * the published result cannot be read, so the deploy keeps the current badge.
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "static", "badges");
const PUBLISHED_URL = "https://www.navidrome.org/badges/container-downloads-details.json";
const IS_PRODUCTION = process.env.HUGO_ENV === "production";

async function dockerHubPulls(repo) {
  const data = await getJson(`https://hub.docker.com/v2/repositories/${repo}/`);
  return data.pull_count;
}

// GHCR has no API for downloads. The exact count is in the title of the
// "Total downloads" value on the package page, as eliasbenb/ghcr-badge reads it.
async function ghcrDownloads() {
  const html = await getText("https://github.com/navidrome/navidrome/pkgs/container/navidrome");
  const match = html.match(/Total downloads[\s\S]{0,500}?<h3\b[^>]*\btitle="([\d,]+)"/i);
  if (!match) throw new Error("Total downloads not found on the GHCR page");
  return Number(match[1].replace(/,/g, ""));
}

const SOURCES = {
  "docker.io/deluan/navidrome": () => dockerHubPulls("deluan/navidrome"),
  "docker.io/navidrome/navidrome": () => dockerHubPulls("navidrome/navidrome"),
  "ghcr.io/navidrome/navidrome": ghcrDownloads,
};

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response;
}
const getJson = async (url) => (await get(url)).json();
const getText = async (url) => (await get(url)).text();

const isCount = (n) => Number.isSafeInteger(n) && n >= 0;

// A complete result has a count for every source, and their sum as total
function isComplete(details) {
  const images = Object.keys(SOURCES);
  return (
    !Number.isNaN(Date.parse(details?.collectedAt)) &&
    details.sources?.length === images.length &&
    details.sources.every((s, i) => s.image === images[i] && isCount(s.count)) &&
    details.total === details.sources.reduce((sum, s) => sum + s.count, 0)
  );
}

async function collect() {
  const sources = [];
  for (const [image, count] of Object.entries(SOURCES)) {
    sources.push({ image, count: await count() });
  }
  return {
    schemaVersion: 1,
    collectedAt: new Date().toISOString(),
    total: sources.reduce((sum, s) => sum + s.count, 0),
    sources,
  };
}

function write(details) {
  // Shields rejects any field that is not part of its endpoint schema
  const badge = {
    schemaVersion: 1,
    label: "docker pulls",
    message: new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(details.total),
    color: "blue",
    namedLogo: "docker",
    cacheSeconds: 21600,
  };
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "container-downloads.json"), JSON.stringify(badge, null, 2) + "\n");
  fs.writeFileSync(path.join(OUTPUT_DIR, "container-downloads-details.json"), JSON.stringify(details, null, 2) + "\n");
}

async function main() {
  try {
    const details = await collect();
    if (!isComplete(details)) throw new Error(`Invalid counts: ${JSON.stringify(details.sources)}`);
    write(details);
    console.log(`Collected ${details.total} container downloads at ${details.collectedAt}`);
    return;
  } catch (err) {
    console.warn(`::warning::Container download counts not refreshed: ${err.message}`);
  }

  // Keep the last complete result, from the published website
  const response = await fetch(PUBLISHED_URL, { signal: AbortSignal.timeout(30000) }).catch((err) => err);
  if (response.status === 404) {
    console.warn("::warning::No result was published yet, so no badge was written");
    return;
  }
  const published = response.ok ? await response.json().catch(() => null) : null;
  if (!isComplete(published)) {
    const message = `Published result not usable (${response.status ?? response.message}), so no badge was written`;
    if (IS_PRODUCTION) throw new Error(message);
    console.warn(`::warning::${message}`);
    return;
  }
  write(published);
  console.log(`Kept the result collected at ${published.collectedAt}`);
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  process.exit(1);
});
