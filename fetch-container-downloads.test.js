const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  SOURCES,
  BADGE_FILE,
  DETAILS_FILE,
  parseDockerHubPullCount,
  parseGhcrDownloadCount,
  formatCount,
  buildBadge,
  isValidDetails,
  run,
} = require("./fetch-container-downloads");

const NOW = new Date("2026-10-16T00:00:00.000Z");
const PUBLISHED_URL = "https://site.test/badges/container-downloads-details.json";

const ghcrPage = (title, text) =>
  `<span>Total downloads</span>\n<h3 title="${title}">${text}</h3>`;

class HttpError {
  constructor(status) {
    this.status = status;
  }
}

// Answers like the real registries, so tests can make any source fail
function fakeFetch({ deluan = 58886962, navidrome = 141714, ghcr = 2661197, published } = {}) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const reply = (status, body) => ({
      ok: status >= 200 && status < 300,
      status,
      json: async () => JSON.parse(body),
      text: async () => body,
    });
    const value = (v, body) => {
      if (v instanceof Error) throw v;
      if (v instanceof HttpError) return reply(v.status, "error");
      return reply(200, body(v));
    };
    if (url.includes("/repositories/deluan/navidrome/"))
      return value(deluan, (v) => JSON.stringify({ pull_count: v }));
    if (url.includes("/repositories/navidrome/navidrome/"))
      return value(navidrome, (v) => JSON.stringify({ pull_count: v }));
    if (url.includes("/pkgs/container/navidrome"))
      return value(ghcr, (v) => ghcrPage(v, formatCount(v)));
    if (url === PUBLISHED_URL) {
      if (published === undefined) return reply(404, "not found");
      return value(published, (v) => JSON.stringify(v));
    }
    throw new Error(`unexpected url ${url}`);
  };
  fn.calls = calls;
  return fn;
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "container-downloads-"));
}

function runWith(fetchImpl, outputDir, extra = {}) {
  return run({
    fetchImpl,
    outputDir,
    publishedUrl: PUBLISHED_URL,
    now: () => NOW,
    log: () => {},
    retryDelayMs: 0,
    ...extra,
  });
}

const readJson = (dir, file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));

function previousDetails(overrides = {}) {
  const counts = [58000000, 100000, 2500000];
  return {
    schemaVersion: 1,
    collectedAt: "2026-10-15T00:00:00.000Z",
    total: counts.reduce((a, b) => a + b, 0),
    sources: SOURCES.map((s, i) => ({ image: s.image, count: counts[i] })),
    ...overrides,
  };
}

test("reads the exact pull count from a Docker Hub response", () => {
  assert.equal(parseDockerHubPullCount({ pull_count: 58886962 }), 58886962);
});

test("rejects a Docker Hub response without a whole, non-negative pull count", () => {
  for (const body of [{}, { pull_count: "12" }, { pull_count: -1 }, { pull_count: 1.5 }, null]) {
    assert.throws(() => parseDockerHubPullCount(body), /pull_count/);
  }
});

test("reads the exact GHCR total from the title, not the rounded text", () => {
  assert.equal(parseGhcrDownloadCount(ghcrPage("2661197", "2.66M")), 2661197);
  assert.equal(parseGhcrDownloadCount(ghcrPage("2,661,197", "2.66M")), 2661197);
  assert.equal(parseGhcrDownloadCount(ghcrPage("950", "950")), 950);
});

test("rejects a GHCR page without an exact total", () => {
  assert.throws(() => parseGhcrDownloadCount("<h1>Sign in</h1>"), /Total downloads/);
  assert.throws(() => parseGhcrDownloadCount(ghcrPage("2.66M", "2.66M")), /exact/);
});

test("rejects a GHCR total that does not agree with the text GitHub shows", () => {
  assert.throws(() => parseGhcrDownloadCount(ghcrPage("266", "2.66M")), /does not match/);
  assert.throws(() => parseGhcrDownloadCount(ghcrPage("951", "950")), /does not match/);
});

test("formats counts in a short form for the badge", () => {
  assert.equal(formatCount(61689873), "61.7M");
  assert.equal(formatCount(950), "950");
});

test("builds a badge that only uses Shields endpoint fields", () => {
  const badge = buildBadge(previousDetails());
  assert.deepEqual(Object.keys(badge).sort(), [
    "cacheSeconds",
    "color",
    "label",
    "message",
    "namedLogo",
    "schemaVersion",
  ]);
  assert.equal(badge.schemaVersion, 1);
  assert.equal(badge.message, "60.6M");
});

test("accepts only complete details whose total is the sum of all sources", () => {
  assert.equal(isValidDetails(previousDetails(), NOW), true);
  assert.equal(isValidDetails(previousDetails({ total: 1 }), NOW), false);
  assert.equal(isValidDetails(previousDetails({ sources: previousDetails().sources.slice(1) }), NOW), false);
  assert.equal(isValidDetails(previousDetails({ collectedAt: "yesterday" }), NOW), false);
  assert.equal(isValidDetails(previousDetails({ collectedAt: "2026-10-17T00:00:00.000Z" }), NOW), false);
  assert.equal(isValidDetails(null, NOW), false);
});

test("writes fresh exact counts, their sum and the collection time", async () => {
  const dir = tempDir();
  const result = await runWith(fakeFetch(), dir);

  assert.equal(result.status, "fresh");
  assert.deepEqual(readJson(dir, DETAILS_FILE), {
    schemaVersion: 1,
    collectedAt: NOW.toISOString(),
    total: 58886962 + 141714 + 2661197,
    sources: [
      { image: "docker.io/deluan/navidrome", count: 58886962 },
      { image: "docker.io/navidrome/navidrome", count: 141714 },
      { image: "ghcr.io/navidrome/navidrome", count: 2661197 },
    ],
  });
  assert.equal(readJson(dir, BADGE_FILE).message, "61.7M");
});

test("retries a source once before it counts as failed", async () => {
  const dir = tempDir();
  let failures = 1;
  const base = fakeFetch();
  const flaky = async (url) => {
    if (url.includes("/pkgs/container/") && failures-- > 0) throw new Error("socket hang up");
    return base(url);
  };
  const result = await runWith(flaky, dir);
  assert.equal(result.status, "fresh");
});

test("keeps the published result unchanged when one source fails", async () => {
  const dir = tempDir();
  const published = previousDetails();
  const result = await runWith(fakeFetch({ ghcr: new HttpError(503), published }), dir);

  assert.equal(result.status, "previous");
  assert.deepEqual(readJson(dir, DETAILS_FILE), published);
  assert.deepEqual(readJson(dir, BADGE_FILE), buildBadge(published));
});

test("never mixes fresh counts with an old result", async () => {
  const dir = tempDir();
  const published = previousDetails();
  await runWith(fakeFetch({ navidrome: new Error("timeout"), published }), dir);
  assert.equal(readJson(dir, DETAILS_FILE).sources[0].count, published.sources[0].count);
});

test("keeps the newest valid result from the local and published copies", async () => {
  const dir = tempDir();
  const local = previousDetails({ collectedAt: "2026-10-14T00:00:00.000Z" });
  fs.writeFileSync(path.join(dir, DETAILS_FILE), JSON.stringify(local));
  const published = previousDetails();

  await runWith(fakeFetch({ deluan: new HttpError(500), published }), dir);
  assert.deepEqual(readJson(dir, DETAILS_FILE), published);
});

test("ignores an invalid published result", async () => {
  const dir = tempDir();
  const local = previousDetails({ collectedAt: "2026-10-14T00:00:00.000Z" });
  fs.writeFileSync(path.join(dir, DETAILS_FILE), JSON.stringify(local));

  const result = await runWith(fakeFetch({ deluan: new HttpError(500), published: { total: 5 } }), dir);
  assert.equal(result.status, "previous");
  assert.deepEqual(readJson(dir, DETAILS_FILE), local);
});

test("writes nothing when a source fails and no result was ever published", async () => {
  const dir = tempDir();
  const result = await runWith(fakeFetch({ ghcr: new HttpError(500) }), dir);

  assert.equal(result.status, "none");
  assert.equal(result.mustFail, false);
  assert.equal(fs.existsSync(path.join(dir, DETAILS_FILE)), false);
  assert.equal(fs.existsSync(path.join(dir, BADGE_FILE)), false);
});

test("asks to stop the deploy when a source fails and the published result cannot be read", async () => {
  const dir = tempDir();
  const result = await runWith(fakeFetch({ ghcr: new HttpError(500), published: new HttpError(503) }), dir);

  assert.equal(result.status, "none");
  assert.equal(result.mustFail, true);
});

// Runs the script the way the workflows do, with fetch replaced before it loads.
// The script writes next to itself, so it runs from a temporary copy.
function runScript({ failGhcr = false, published = 404, env = {} } = {}) {
  const dir = tempDir();
  fs.copyFileSync(
    path.join(__dirname, "fetch-container-downloads.js"),
    path.join(dir, "fetch-container-downloads.js"),
  );
  const preload = path.join(dir, "fake-fetch.js");
  fs.writeFileSync(
    preload,
    `globalThis.fetch = async (url) => {
      const reply = (status, body) => ({
        ok: status < 300, status,
        json: async () => JSON.parse(body), text: async () => body,
      });
      if (url.includes("/pkgs/container/")) {
        if (${failGhcr}) throw new Error("simulated GHCR outage");
        return reply(200, '<span>Total downloads</span><h3 title="2661197">2.66M</h3>');
      }
      if (url.includes("hub.docker.com")) return reply(200, '{"pull_count":100}');
      return reply(${published}, "unavailable");
    };`,
  );
  const { spawnSync } = require("child_process");
  const { HUGO_ENV, ...parentEnv } = process.env;
  const result = spawnSync(process.execPath, ["-r", preload, "fetch-container-downloads.js"], {
    cwd: dir,
    env: { ...parentEnv, ...env },
    encoding: "utf8",
  });
  return { ...result, output: result.stdout + result.stderr, badgesDir: path.join(dir, "static", "badges") };
}

test("the workflow command writes both files when every source answers", () => {
  const result = runScript();
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.output, /::warning::/);
  assert.equal(readJson(result.badgesDir, DETAILS_FILE).total, 2661397);
  assert.equal(readJson(result.badgesDir, BADGE_FILE).message, "2.7M");
});

test("a preview build warns and continues when a source fails", () => {
  const result = runScript({ failGhcr: true, published: 503 });
  assert.equal(result.status, 0);
  assert.match(result.output, /::warning::Container download counts not refreshed: .*simulated GHCR outage/);
  assert.equal(fs.existsSync(result.badgesDir), false);
});

test("a production build stops when a source fails and the published result cannot be read", () => {
  const result = runScript({ failGhcr: true, published: 503, env: { HUGO_ENV: "production" } });
  assert.equal(result.status, 1);
  assert.match(result.output, /::error::Container download counts not refreshed: .*simulated GHCR outage/);
});
