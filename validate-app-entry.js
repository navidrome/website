#!/usr/bin/env node

/**
 * Validate App Entry Script
 *
 * Usage: node validate-app-entry.js <app-name>
 * Example: node validate-app-entry.js dsub
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// Detect if running in CI environment
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

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
  constructor(appName) {
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

  // Validate URL (checks if it's reachable)
  validateUrl(url, description) {
    return new Promise((resolve) => {
      if (!url) {
        resolve();
        return;
      }

      // Basic URL format check
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch (err) {
        this.addError(`Invalid URL format for ${description}: ${url}`);
        resolve();
        return;
      }

      const protocol = parsedUrl.protocol === "https:" ? https : http;
      const timeout = 5000; // 5 seconds

      const options = {
        method: "HEAD", // Use HEAD instead of GET for faster response
        headers: {
          "User-Agent": "Navidrome-App-Validator/1.0",
        },
      };

      const req = protocol.request(url, options, (res) => {
        // Follow redirects (3xx) silently
        if (res.statusCode >= 300 && res.statusCode < 400) {
          resolve();
          return;
        }

        if (res.statusCode >= 400) {
          this.addWarning(
            `${description} returned status ${res.statusCode}: ${url}`
          );
        }
        resolve();
      });

      // Set timeout properly
      req.setTimeout(timeout, () => {
        req.destroy();
        this.addWarning(`${description} request timed out: ${url}`);
        resolve();
      });

      req.on("error", (err) => {
        if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
          this.addWarning(`${description} appears unreachable: ${url}`);
        } else if (err.code !== "ETIMEDOUT" && err.code !== "ECONNRESET") {
          this.addWarning(`${description} validation failed: ${err.message}`);
        }
        resolve();
      });

      req.end();
    });
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

  // Main validation method
  async validate() {
    if (isCI) {
      console.log(`App: ${this.appName}`);
    } else {
      this.log(
        `\nValidating app: ${colors.cyan}${this.appName}${colors.reset}\n`
      );
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

    // Validate URLs
    if (!isCI) {
      this.log("Checking URLs (this may take a moment)...", "blue");
    }
    await this.validateUrls(data);

    this.printResults();
  }

  // Print validation results
  printResults() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      if (isCI) {
        console.log("Status: PASSED ✅");
      } else {
        console.log("");
        this.log("✅ Validation passed! No errors or warnings found.", "green");
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
  const appName = process.argv[2];

  if (!appName) {
    console.error(`${colors.red}Error: App name is required${colors.reset}`);
    console.log(`\nUsage: node validate-app-entry.js <app-name>`);
    console.log(`Example: node validate-app-entry.js dsub\n`);
    process.exit(1);
  }

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

  const validator = new AppValidator(appName);
  const exitCode = await validator.validate();
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`${colors.red}Unexpected error: ${err.message}${colors.reset}`);
  process.exit(1);
});
