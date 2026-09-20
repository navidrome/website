#!/usr/bin/env node

/**
 * Validate App Entry Script
 *
 * Usage: node validate-app-entry.js <app-name>
 * Example: node validate-app-entry.js dsub
 */

const fs = require("fs");
const path = require("path");

// Detect if running in CI environment
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

// Minimum stars an open source app's public repository should have.
// Keep in sync with content/en/docs/developers/adding-apps.md
const MIN_REPO_STARS = 15;

// Hosts known to expose a star count, so a lookup that comes back empty there
// is a broken check rather than an unsupported forge
const KNOWN_STAR_HOSTS = ["github.com", "gitlab.com", "codeberg.org"];

const USER_AGENT = "Navidrome-App-Validator/1.0";
const REQUEST_TIMEOUT = 5000; // 5 seconds

// A host that resolves to nothing is worth reporting; a dropped connection is
// noise, so it is ignored the way the URL check has always ignored it
const UNREACHABLE_ERROR_CODES = ["ENOTFOUND", "ECONNREFUSED"];
const TRANSIENT_ERROR_CODES = ["ETIMEDOUT", "ECONNRESET"];

// Classify a request that produced no response. fetch reports network trouble
// as a TypeError and keeps the real code and message on the cause.
function classifyRequestError(err) {
  if (err.name === "TimeoutError") return { kind: "timeout" };

  const cause = err.cause || err;
  if (UNREACHABLE_ERROR_CODES.includes(cause.code)) {
    return { kind: "unreachable" };
  }
  if (TRANSIENT_ERROR_CODES.includes(cause.code)) return { kind: "transient" };

  return { kind: "failed", message: cause.message || err.message };
}

// Token that lifts the anonymous GitHub API rate limit. HUGO_GITHUB_TOKEN is
// the name the site build already uses, see layouts/partials/last-updated/
function githubToken() {
  return process.env.GITHUB_TOKEN || process.env.HUGO_GITHUB_TOKEN;
}

// Color codes for terminal output (disabled in CI)
const colors = isCI
  ? {
      reset: "",
      red: "",
      green: "",
      yellow: "",
      blue: "",
      cyan: "",
    }
  : {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      cyan: "\x1b[36m",
    };

class AppValidator {
  constructor(appName, options = {}) {
    this.appName = appName;
    this.appDir = path.join(process.cwd(), "assets", "apps", appName);
    this.yamlPath = path.join(this.appDir, "index.yaml");
    this.schemaPath = path.join(
      process.cwd(),
      "assets",
      "apps",
      "app-schema.json"
    );
    this.errors = [];
    this.warnings = [];
    this.quiet = options.quiet || false;
  }

  log(message, color = "reset") {
    if (isCI) {
      // In CI, just output plain text
      console.log(message);
    } else {
      console.log(`${colors[color]}${message}${colors.reset}`);
    }
  }

  addError(message) {
    this.errors.push(message);
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  // Check if app directory exists
  checkDirectory() {
    if (!fs.existsSync(this.appDir)) {
      this.addError(`App directory not found: ${this.appDir}`);
      return false;
    }
    return true;
  }

  // Check if index.yaml exists and is valid YAML
  async validateYaml() {
    if (!fs.existsSync(this.yamlPath)) {
      this.addError("index.yaml file not found");
      return null;
    }

    try {
      const yaml = require("js-yaml");
      const content = fs.readFileSync(this.yamlPath, "utf8");
      const data = yaml.load(content);
      return data;
    } catch (err) {
      this.addError(`Invalid YAML syntax: ${err.message}`);
      return null;
    }
  }

  // Validate against JSON Schema
  async validateSchema(data) {
    if (!data) return;

    try {
      const Ajv = require("ajv");
      const addFormats = require("ajv-formats");

      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);

      const schema = JSON.parse(fs.readFileSync(this.schemaPath, "utf8"));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      if (!valid) {
        validate.errors.forEach((err) => {
          const field = err.instancePath || "root";
          const message = err.message;
          const detail = err.params ? JSON.stringify(err.params) : "";
          this.addError(
            `Schema validation: ${field} ${message} ${detail}`.trim()
          );
        });
      }
    } catch (err) {
      this.addError(`Schema validation failed: ${err.message}`);
    }
  }

  // Check if image files exist
  validateImages(data) {
    if (!data || !data.screenshots) return;

    // Check thumbnail
    if (data.screenshots.thumbnail) {
      const thumbnailPath = path.join(this.appDir, data.screenshots.thumbnail);
      if (!fs.existsSync(thumbnailPath)) {
        this.addError(
          `Thumbnail image not found: ${data.screenshots.thumbnail}`
        );
      } else {
        // Check file size (warn if > 500KB)
        const stats = fs.statSync(thumbnailPath);
        const sizeInKB = stats.size / 1024;
        if (sizeInKB > 500) {
          this.addWarning(
            `Thumbnail is ${Math.round(sizeInKB)}KB (recommended: < 500KB)`
          );
        }
      }
    }

    // Check gallery images
    if (data.screenshots.gallery && Array.isArray(data.screenshots.gallery)) {
      data.screenshots.gallery.forEach((imgPath) => {
        const fullPath = path.join(this.appDir, imgPath);
        if (!fs.existsSync(fullPath)) {
          this.addError(`Gallery image not found: ${imgPath}`);
        } else {
          // Check file size
          const stats = fs.statSync(fullPath);
          const sizeInKB = stats.size / 1024;
          if (sizeInKB > 500) {
            this.addWarning(
              `Gallery image ${imgPath} is ${Math.round(
                sizeInKB
              )}KB (recommended: < 500KB)`
            );
          }
        }
      });
    }
  }

  // Check for image files in the app folder that are not referenced in index.yaml
  validateDanglingImages(data) {
    if (!data) return;

    // Collect all images referenced by the entry
    const referenced = new Set();
    if (data.screenshots) {
      if (data.screenshots.thumbnail) {
        referenced.add(data.screenshots.thumbnail);
      }
      if (Array.isArray(data.screenshots.gallery)) {
        data.screenshots.gallery.forEach((img) => referenced.add(img));
      }
    }

    const imageExtensions = [".png", ".webp", ".jpg", ".jpeg"];

    let files;
    try {
      files = fs.readdirSync(this.appDir, { withFileTypes: true });
    } catch (err) {
      this.addError(`Unable to read app directory: ${err.message}`);
      return;
    }

    files.forEach((dirent) => {
      if (!dirent.isFile()) return;
      const ext = path.extname(dirent.name).toLowerCase();
      if (!imageExtensions.includes(ext)) return;
      if (!referenced.has(dirent.name)) {
        this.addError(
          `Dangling image not referenced in index.yaml: ${dirent.name}`
        );
      }
    });
  }

  // Single HTTP entry point for every check below. Never throws - validation
  // is advisory, so a broken host must not abort the run. Returns { res } for
  // any reply, or { error } when nothing came back.
  async request(url, { method = "GET", redirect = "follow", headers = {} } = {}) {
    try {
      const res = await fetch(url, {
        method,
        redirect,
        headers: { "User-Agent": USER_AGENT, ...headers },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      return { res };
    } catch (err) {
      return { error: classifyRequestError(err) };
    }
  }

  // Status-only request. Redirects are reported rather than followed, and any
  // body is discarded so the connection is released right away.
  async requestStatus(url, method) {
    const { res, error } = await this.request(url, {
      method,
      redirect: "manual",
    });
    if (res) await res.body?.cancel().catch(() => {});
    return { status: res?.status, error };
  }

  // Validate URL (checks if it's reachable)
  async validateUrl(url, description) {
    if (!url) return;

    // Basic URL format check
    try {
      new URL(url);
    } catch (err) {
      this.addError(`Invalid URL format for ${description}: ${url}`);
      return;
    }

    // HEAD is enough to prove a URL resolves, and is cheaper than GET
    let { status, error } = await this.requestStatus(url, "HEAD");

    // Retry with GET if the server doesn't support HEAD
    if (status === 405) {
      ({ status, error } = await this.requestStatus(url, "GET"));
      // Only a timeout on the retry is worth reporting
      if (error && error.kind !== "timeout") return;
    }

    if (error) {
      if (error.kind === "timeout") {
        this.addWarning(`${description} request timed out: ${url}`);
      } else if (error.kind === "unreachable") {
        this.addWarning(`${description} appears unreachable: ${url}`);
      } else if (error.kind === "failed") {
        this.addWarning(`${description} validation failed: ${error.message}`);
      }
      return;
    }

    // A redirect means the URL resolves, which is all this check needs
    if (status >= 300 && status < 400) return;

    if (status >= 400) {
      this.addWarning(`${description} returned status ${status}: ${url}`);
    }
  }

  // Validate all URLs in the app data
  async validateUrls(data) {
    if (!data) return;

    const urlChecks = [];

    // Main app URL
    if (data.url) {
      urlChecks.push(this.validateUrl(data.url, "App URL"));
    }

    // Repository URL
    if (data.repoUrl) {
      urlChecks.push(this.validateUrl(data.repoUrl, "Repository URL"));
    }

    // Platform store URLs
    if (data.platforms) {
      ["android", "ios", "macos"].forEach((platform) => {
        if (
          data.platforms[platform] &&
          typeof data.platforms[platform] === "object"
        ) {
          if (data.platforms[platform].store) {
            urlChecks.push(
              this.validateUrl(
                data.platforms[platform].store,
                `${platform} store URL`
              )
            );
          }
        }
      });
    }

    await Promise.all(urlChecks);
  }

  // Split a repo URL into the pieces the star lookup needs, or null when it
  // cannot be parsed. Deep links such as /tree/<ref>/... or /-/blob/... and a
  // trailing .git are trimmed so the repository itself is left.
  parseRepoUrl(repoUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(repoUrl);
    } catch (err) {
      return null;
    }

    return {
      host: parsedUrl.hostname.replace(/^www\./, ""),
      origin: parsedUrl.origin,
      repoPath: parsedUrl.pathname
        .replace(/\.git$/, "")
        .replace(/\/(-|tree|blob|src|commit)\/.*$/, "")
        .replace(/^\/+|\/+$/g, ""),
    };
  }

  // Build the API endpoints that can report a star count for a repo. GitHub
  // gets a dedicated probe; any other host is tried as Gitea/Forgejo first and
  // GitLab second, which covers Codeberg, self-hosted Gitea, and both
  // gitlab.com and self-hosted GitLab.
  getStarProbes(repo) {
    const [owner, name] = repo.repoPath.split("/");
    if (!name) return [];

    const ownerRepo = `${owner}/${name}`;

    if (repo.host === "github.com") {
      return [
        {
          url: `https://api.github.com/repos/${ownerRepo}`,
          field: "stargazers_count",
        },
      ];
    }

    return [
      {
        url: `${repo.origin}/api/v1/repos/${ownerRepo}`,
        field: "stars_count",
      },
      {
        // GitLab supports subgroups, so keep the full path here
        url: `${repo.origin}/api/v4/projects/${encodeURIComponent(
          repo.repoPath
        )}`,
        field: "star_count",
      },
    ];
  }

  // Explain why a probe could not answer, or return null when the host simply
  // does not speak that API and the next probe should be tried. A 404 or a
  // non-JSON reply means "wrong forge"; a timeout, throttle, or server error
  // means the check itself is broken and must not pass silently.
  probeFailure(probeUrl, status) {
    const host = new URL(probeUrl).hostname;

    if (status === null) return `${host} did not respond`;
    if (status === 401) return `${host} rejected the token (401)`;
    if (status === 403 || status === 429) {
      return host === "api.github.com"
        ? `${host} rate limit reached, set GITHUB_TOKEN to raise it`
        : `${host} refused the request (${status})`;
    }
    if (status >= 500) return `${host} returned ${status}`;

    return null;
  }

  // Fetch and parse a JSON endpoint. Never throws - the star check is
  // advisory, so an unreachable host must not break validation. Returns the
  // status next to the body, so callers can tell "this host has no such API"
  // (404, or a non-JSON reply) from "the lookup failed" (no answer, throttled,
  // server error). A null status means nothing usable came back at all.
  async fetchJson(url) {
    const headers = { Accept: "application/json" };

    // CI runners share outbound IPs, so anonymous GitHub API calls can be
    // throttled by unrelated traffic. Authenticate whenever a token is around.
    const token = githubToken();
    if (token && url.startsWith("https://api.github.com/")) {
      headers.Authorization = `Bearer ${token}`;
    }

    const { res, error } = await this.request(url, { headers });
    if (error) return { status: null, json: null };

    if (!res.ok) {
      await res.body?.cancel().catch(() => {});
      return { status: res.status, json: null };
    }

    try {
      return { status: res.status, json: await res.json() };
    } catch (err) {
      // Timing out mid-body is a failed lookup; anything else means the host
      // answered with something that is not JSON, so it lacks this API
      const timedOut = err.name === "TimeoutError";
      return { status: timedOut ? null : res.status, json: null };
    }
  }

  // Warn when an open source app's public repository has too few stars.
  // Hosts without a usable star API (cgit, tangled, ...) are skipped silently.
  async validateRepoStars(data) {
    if (!data || !data.repoUrl) return;
    // Same rule the site renders with, see layouts/partials/app-card.html
    if (data.isOpenSource === false) return;

    const repo = this.parseRepoUrl(data.repoUrl);
    if (!repo) return; // validateUrl already reports a malformed repoUrl

    let failure = null;

    for (const probe of this.getStarProbes(repo)) {
      const { status, json } = await this.fetchJson(probe.url);
      const stars = json?.[probe.field];

      if (typeof stars === "number") {
        if (stars < MIN_REPO_STARS) {
          this.addWarning(
            `Repository has ${stars} star(s), below the recommended minimum of ${MIN_REPO_STARS}: ${data.repoUrl}`
          );
        }
        return;
      }

      failure = failure || this.probeFailure(probe.url, status);
    }

    // Keeping quiet here would make a broken lookup look like a clean pass, so
    // say so - but only when the host was supposed to be able to answer
    if (!failure && !KNOWN_STAR_HOSTS.includes(repo.host)) return;

    this.addWarning(
      `Could not verify the star count (minimum ${MIN_REPO_STARS}): ${
        data.repoUrl
      }${failure ? ` - ${failure}` : ""}`
    );
  }

  // Main validation method
  async validate() {
    if (!this.quiet) {
      if (isCI) {
        console.log(`App: ${this.appName}`);
      } else {
        this.log(
          `\nValidating app: ${colors.cyan}${this.appName}${colors.reset}\n`
        );
      }
    }

    // Check directory
    if (!this.checkDirectory()) {
      return this.printResults();
    }

    // Validate YAML
    const data = await this.validateYaml();

    // Validate against schema
    await this.validateSchema(data);

    // Validate images
    this.validateImages(data);

    // Check for dangling (unreferenced) images
    this.validateDanglingImages(data);

    // Validate URLs
    if (!isCI && !this.quiet) {
      this.log("Checking URLs (this may take a moment)...", "blue");
    }
    // Both only read data and append warnings, so they can run together
    await Promise.all([this.validateUrls(data), this.validateRepoStars(data)]);

    return this.printResults();
  }

  // Print validation results
  printResults() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      if (!this.quiet) {
        if (isCI) {
          console.log("Status: PASSED ✅");
        } else {
          console.log("");
          this.log(
            "✅ Validation passed! No errors or warnings found.",
            "green"
          );
        }
      }
      return 0;
    }

    if (isCI) {
      console.log("Status: FAILED ❌\n");
    }

    if (this.errors.length > 0) {
      if (isCI) {
        console.log(`Errors (${this.errors.length}):`);
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      } else {
        this.log(`\n❌ Found ${this.errors.length} error(s):`, "red");
        this.errors.forEach((error, index) => {
          this.log(`  ${index + 1}. ${error}`, "red");
        });
      }
    }

    if (this.warnings.length > 0) {
      if (isCI) {
        console.log(`\nWarnings (${this.warnings.length}):`);
        this.warnings.forEach((warning, index) => {
          console.log(`  ${index + 1}. ${warning}`);
        });
      } else {
        this.log(`\n⚠️  Found ${this.warnings.length} warning(s):`, "yellow");
        this.warnings.forEach((warning, index) => {
          this.log(`  ${index + 1}. ${warning}`, "yellow");
        });
      }
    }

    console.log("");
    return this.errors.length > 0 ? 1 : 0;
  }
}

// Main execution
async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  const quiet = args.includes("-q") || args.includes("--quiet");
  const appName = args.find((arg) => !arg.startsWith("-"));

  // Check for required dependencies
  const requiredModules = ["js-yaml", "ajv", "ajv-formats"];
  const missingModules = [];

  for (const mod of requiredModules) {
    try {
      require.resolve(mod);
    } catch (e) {
      missingModules.push(mod);
    }
  }

  if (missingModules.length > 0) {
    console.error(
      `${colors.red}Error: Missing required dependencies${colors.reset}`
    );
    console.log(`\nPlease install the following packages:`);
    console.log(`  npm install ${missingModules.join(" ")}\n`);
    process.exit(1);
  }

  // If no app name provided, validate all apps
  if (!appName) {
    const appsDir = path.join(process.cwd(), "assets", "apps");

    if (!fs.existsSync(appsDir)) {
      console.error(
        `${colors.red}Error: Apps directory not found: ${appsDir}${colors.reset}`
      );
      process.exit(1);
    }

    const appDirs = fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== "_template")
      .map((dirent) => dirent.name)
      .sort();

    if (appDirs.length === 0) {
      console.log("No app entries found to validate");
      process.exit(0);
    }

    // One GitHub API call per app busts the 60/hour anonymous limit, which
    // would turn every star check into an "unverified" warning. Say it once
    // here rather than once per app.
    if (!githubToken()) {
      console.log(
        `${colors.yellow}Note:${colors.reset} checking every app needs a GitHub token.`
      );
      console.log(
        "Without one the anonymous API limit runs out and star counts stay unverified."
      );
      console.log("  export GITHUB_TOKEN=$(gh auth token)\n");
    }

    if (!quiet) {
      console.log(`Validating ${appDirs.length} app(s)...\n`);
    }

    let totalErrors = 0;
    let failedApps = [];

    for (const app of appDirs) {
      const validator = new AppValidator(app, { quiet });
      const exitCode = await validator.validate();

      if (exitCode !== 0) {
        totalErrors++;
        failedApps.push(app);
      }

      // Add separator between apps (except for last one) when not quiet
      if (!quiet && app !== appDirs[appDirs.length - 1]) {
        console.log("\n" + "=".repeat(60) + "\n");
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("\nValidation Summary:");
    console.log(`  Total apps: ${appDirs.length}`);
    console.log(`  Passed: ${appDirs.length - totalErrors}`);
    console.log(`  Failed: ${totalErrors}`);

    if (failedApps.length > 0) {
      console.log(`\nFailed apps: ${failedApps.join(", ")}`);
    }

    process.exit(totalErrors > 0 ? 1 : 0);
  }

  // Single app validation
  const validator = new AppValidator(appName, { quiet });
  const exitCode = await validator.validate();
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`${colors.red}Unexpected error: ${err.message}${colors.reset}`);
  process.exit(1);
});
