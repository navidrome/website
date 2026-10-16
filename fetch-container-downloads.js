#!/usr/bin/env node

/**
 * Fetch Container Downloads Script
 *
 * Sums the downloads of the Navidrome container images and writes them as a
 * Shields endpoint badge, published with the website:
 *   /badges/container-downloads.json         - Shields endpoint badge
 *   /badges/container-downloads-details.json - exact counts and collection time
 *
 * A result is only written when every source answers. When one fails, the last
 * complete result is kept, taken from the newest valid copy found locally or on
 * the published website. Each website deploy replaces all files, so a build
 * that wrote nothing would remove the badge.
 *
 * Usage: node fetch-container-downloads.js
 *
 * In production (HUGO_ENV=production), the script fails if a source fails and
 * the published result cannot be read, so the deploy keeps the current badge.
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "static", "badges");
const BADGE_FILE = "container-downloads.json";
const DETAILS_FILE = "container-downloads-details.json";
const PUBLISHED_URL = `https://www.navidrome.org/badges/${DETAILS_FILE}`;

// Docker Hub returns exact counts in its API. GHCR has no API for downloads,
// so its count is read from the package page, like
// https://github.com/eliasbenb/ghcr-badge does.
const SOURCES = [
  {
    image: "docker.io/deluan/navidrome",
    url: "https://hub.docker.com/v2/repositories/deluan/navidrome/",
    parse: async (response) => parseDockerHubPullCount(await response.json()),
  },
  {
    image: "docker.io/navidrome/navidrome",
    url: "https://hub.docker.com/v2/repositories/navidrome/navidrome/",
    parse: async (response) => parseDockerHubPullCount(await response.json()),
  },
  {
    image: "ghcr.io/navidrome/navidrome",
    url: "https://github.com/navidrome/navidrome/pkgs/container/navidrome",
    parse: async (response) => parseGhcrDownloadCount(await response.text()),
  },
];

const REQUEST_TIMEOUT_MS = 30000;
const ATTEMPTS = 2;
const SUFFIXES = { K: 1e3, M: 1e6, B: 1e9 };

const isCount = (value) => Number.isSafeInteger(value) && value >= 0;

function parseDockerHubPullCount(body) {
  const count = body?.pull_count;
  if (!isCount(count)) {
    throw new Error(`Docker Hub response has no valid pull_count: ${JSON.stringify(count)}`);
  }
  return count;
}

function parseGhcrDownloadCount(html) {
  const match = html.match(/Total downloads[\s\S]{0,500}?<h3\b([^>]*)>([^<]+)<\/h3>/i);
  if (!match) {
    throw new Error("GHCR page has no Total downloads value");
  }
  const title = match[1].match(/\btitle="([^"]*)"/i)?.[1] ?? "";
  if (!/^(\d+|\d{1,3}(,\d{3})+)$/.test(title)) {
    throw new Error(`GHCR page has no exact Total downloads value: title="${title}"`);
  }
  const count = Number(title.replace(/,/g, ""));
  if (!isCount(count)) {
    throw new Error(`GHCR Total downloads value is too large: ${title}`);
  }

  // The visible text is rounded (for example "2.66M"). It must agree with the
  // exact title, to catch a page whose layout changed under the pattern above.
  const text = match[2].trim();
  const shown = text.match(/^([\d,]+)(?:\.(\d+))?\s*([KMB])?$/i);
  if (!shown) {
    throw new Error(`GHCR Total downloads text is not a number: "${text}"`);
  }
  const multiplier = SUFFIXES[shown[3]?.toUpperCase()] ?? 1;
  const decimals = shown[2] ?? "";
  const value = Number(`${shown[1].replace(/,/g, "")}.${decimals || "0"}`) * multiplier;
  const precision = multiplier / 10 ** decimals.length;
  const agrees = shown[3] ? Math.abs(count - value) < precision : count === value;
  if (!agrees) {
    throw new Error(`GHCR exact value ${count} does not match the shown value "${text}"`);
  }
  return count;
}

function formatCount(count) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}

// Shields rejects any field that is not part of its endpoint schema
function buildBadge(details) {
  return {
    schemaVersion: 1,
    label: "docker pulls",
    message: formatCount(details.total),
    color: "blue",
    namedLogo: "docker",
    cacheSeconds: 21600,
  };
}

function isValidDetails(details, now) {
  if (!details || details.schemaVersion !== 1) return false;
  const collectedAt = new Date(details.collectedAt);
  if (
    typeof details.collectedAt !== "string" ||
    Number.isNaN(collectedAt.getTime()) ||
    collectedAt.toISOString() !== details.collectedAt ||
    collectedAt > now
  ) {
    return false;
  }
  const sources = details.sources;
  if (!Array.isArray(sources) || sources.length !== SOURCES.length) return false;
  const sameSources = sources.every(
    (source, i) => source?.image === SOURCES[i].image && isCount(source.count),
  );
  if (!sameSources) return false;
  const total = sources.reduce((sum, source) => sum + source.count, 0);
  return isCount(details.total) && details.total === total;
}

async function fetchCount(source, { fetchImpl, retryDelayMs }) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetchImpl(source.url, {
        headers: { "User-Agent": "navidrome-website (+https://www.navidrome.org)" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await source.parse(response);
    } catch (err) {
      lastError = err;
      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }
  throw new Error(`${source.image} (${source.url}): ${lastError.message}`);
}

async function collect(options) {
  const results = await Promise.allSettled(SOURCES.map((source) => fetchCount(source, options)));
  const failures = results.filter((r) => r.status === "rejected").map((r) => r.reason.message);
  if (failures.length > 0) {
    return { failures };
  }
  const sources = SOURCES.map((source, i) => ({ image: source.image, count: results[i].value }));
  return {
    details: {
      schemaVersion: 1,
      collectedAt: options.now().toISOString(),
      total: sources.reduce((sum, source) => sum + source.count, 0),
      sources,
    },
  };
}

function readLocalDetails(outputDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(outputDir, DETAILS_FILE), "utf8"));
  } catch {
    return null;
  }
}

// Returns the published details, or why they could not be used. A 404 means
// nothing was published yet, so there is nothing to keep.
async function fetchPublishedDetails({ fetchImpl, publishedUrl, now }) {
  try {
    const response = await fetchImpl(publishedUrl, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (response.status === 404) {
      return { details: null, unreadable: false, reason: "not published yet" };
    }
    if (!response.ok) {
      return { details: null, unreadable: true, reason: `HTTP ${response.status}` };
    }
    const details = await response.json();
    if (!isValidDetails(details, now())) {
      return { details: null, unreadable: true, reason: "invalid content" };
    }
    return { details, unreadable: false };
  } catch (err) {
    return { details: null, unreadable: true, reason: err.message };
  }
}

function writeJson(outputDir, file, data) {
  const target = path.join(outputDir, file);
  const temp = `${target}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`);
  fs.renameSync(temp, target);
}

function writeResult(outputDir, details) {
  fs.mkdirSync(outputDir, { recursive: true });
  writeJson(outputDir, DETAILS_FILE, details);
  writeJson(outputDir, BADGE_FILE, buildBadge(details));
}

async function run({
  fetchImpl = fetch,
  outputDir = OUTPUT_DIR,
  publishedUrl = PUBLISHED_URL,
  now = () => new Date(),
  log = console.log,
  retryDelayMs = 5000,
} = {}) {
  const fresh = await collect({ fetchImpl, now, retryDelayMs });
  if (fresh.details) {
    writeResult(outputDir, fresh.details);
    log(`Collected ${fresh.details.total} container downloads at ${fresh.details.collectedAt}`);
    return { status: "fresh", details: fresh.details };
  }

  fresh.failures.forEach((failure) => log(`Source failed: ${failure}`));
  const published = await fetchPublishedDetails({ fetchImpl, publishedUrl, now });
  if (!published.details) {
    log(`Published result not used: ${published.reason}`);
  }

  const local = readLocalDetails(outputDir);
  const previous = [published.details, isValidDetails(local, now()) ? local : null]
    .filter(Boolean)
    .sort((a, b) => b.collectedAt.localeCompare(a.collectedAt))[0];

  if (previous) {
    writeResult(outputDir, previous);
    log(`Kept the result collected at ${previous.collectedAt}`);
    return { status: "previous", details: previous, failures: fresh.failures };
  }

  log("No complete result is available, so no badge was written");
  return { status: "none", mustFail: published.unreadable, failures: fresh.failures };
}

if (require.main === module) {
  const isProduction = process.env.HUGO_ENV === "production";
  run()
    .then((result) => {
      if (result.status === "fresh") return;
      const message = `Container download counts not refreshed: ${result.failures.join("; ")}`;
      if (result.mustFail && isProduction) {
        console.error(`::error::${message}`);
        process.exit(1);
      }
      console.warn(`::warning::${message}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  SOURCES,
  BADGE_FILE,
  DETAILS_FILE,
  parseDockerHubPullCount,
  parseGhcrDownloadCount,
  formatCount,
  buildBadge,
  isValidDetails,
  run,
};
