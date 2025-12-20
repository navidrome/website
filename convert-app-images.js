#!/usr/bin/env node

/**
 * Convert App Images Script
 *
 * Converts app images to WebP with max dimension of 1200px
 * Usage: node convert-app-images.js [app-name]
 * If no app-name is provided, converts all apps
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX_SIZE = 1200;
const QUALITY = 80;

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

class ImageConverter {
  constructor() {
    this.appsDir = path.join(process.cwd(), "assets", "apps");
  }

  log(message, color = "reset") {
    if (isCI) {
      console.log(message);
    } else {
      console.log(`${colors[color]}${message}${colors.reset}`);
    }
  }

  // Get image dimensions using sharp
  async getImageDimensions(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return { width: metadata.width, height: metadata.height };
    } catch (err) {
      this.log(`Error getting dimensions for ${imagePath}: ${err.message}`, "red");
      return null;
    }
  }

  // Update YAML file to replace old filename with new filename
  updateYaml(yamlPath, oldName, newName) {
    if (!fs.existsSync(yamlPath)) {
      return;
    }

    try {
      let content = fs.readFileSync(yamlPath, "utf8");
      const updated = content.replace(new RegExp(oldName, "g"), newName);

      if (content !== updated) {
        fs.writeFileSync(yamlPath, updated, "utf8");
        this.log(`  ✓ Updated ${path.basename(yamlPath)}: ${oldName} → ${newName}`, "green");
      }
    } catch (err) {
      this.log(`  Error updating YAML: ${err.message}`, "yellow");
    }
  }

  // Convert a single image
  async convertImage(inputFile) {
    const ext = path.extname(inputFile).toLowerCase();
    const outputFile = inputFile.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    // Get image dimensions
    const dimensions = await this.getImageDimensions(inputFile);
    if (!dimensions) return;

    const { width, height } = dimensions;
    const maxDimension = Math.max(width, height);

    // Skip ONLY if already webp AND smaller than MAX_SIZE
    if (ext === ".webp" && maxDimension <= MAX_SIZE) {
      this.log(
        `  ⊘ Skipping ${path.basename(inputFile)} (${width}x${height}) - already WebP and smaller than ${MAX_SIZE}px`,
        "cyan"
      );
      return;
    }

    // If already webp but too large, resize it in place
    if (ext === ".webp") {
      this.log(`  → Resizing ${path.basename(inputFile)} (${width}x${height})`, "blue");
      try {
        await sharp(inputFile)
          .resize(MAX_SIZE, MAX_SIZE, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: QUALITY })
          .toFile(inputFile + ".tmp");
        
        fs.renameSync(inputFile + ".tmp", inputFile);
        this.log(`  ✓ Resized ${path.basename(inputFile)}`, "green");
      } catch (err) {
        this.log(`  Error resizing: ${err.message}`, "red");
        if (fs.existsSync(inputFile + ".tmp")) {
          fs.unlinkSync(inputFile + ".tmp");
        }
      }
      return;
    }

    // For non-webp files: check if output already exists
    if (fs.existsSync(outputFile)) {
      this.log(`  ✓ ${path.basename(outputFile)} already exists, skipping`, "green");
      return;
    }

    // Process non-webp image
    try {
      if (maxDimension > MAX_SIZE) {
        this.log(
          `  → Resizing and converting ${path.basename(inputFile)} (${width}x${height})`,
          "blue"
        );
      } else {
        this.log(
          `  → Converting ${path.basename(inputFile)} (${width}x${height})`,
          "blue"
        );
      }

      await sharp(inputFile)
        .resize(MAX_SIZE, MAX_SIZE, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputFile);

      this.log(`  ✓ Created ${path.basename(outputFile)}`, "green");

      // Update index.yaml if it exists
      const appDir = path.dirname(inputFile);
      const yamlFile = path.join(appDir, "index.yaml");
      const oldFilename = path.basename(inputFile);
      const newFilename = path.basename(outputFile);

      this.updateYaml(yamlFile, oldFilename, newFilename);

      // Remove the original file after successful conversion
      fs.unlinkSync(inputFile);
      this.log(`  ✓ Removed original file ${path.basename(inputFile)}`, "green");
    } catch (err) {
      this.log(`  Error converting: ${err.message}`, "red");
    }
  }

  // Process a single app
  async processApp(appName) {
    const appDir = path.join(this.appsDir, appName);

    if (!fs.existsSync(appDir)) {
      this.log(`Error: App directory not found: ${appDir}`, "red");
      return;
    }

    this.log(`Processing app: ${appName}`, "cyan");

    // Find all image files (png, jpg, jpeg)
    const imageFiles = this.findImages(appDir);

    if (imageFiles.length === 0) {
      this.log(`  No images found in ${appName}`, "yellow");
    } else {
      for (const image of imageFiles) {
        await this.convertImage(image);
      }
    }

    this.log("", "reset");
  }

  // Recursively find image files in a directory
  findImages(dir) {
    const images = [];
    const imageExtensions = [".png", ".jpg", ".jpeg"];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (imageExtensions.includes(path.extname(item).toLowerCase())) {
          images.push(fullPath);
        }
      });
    };

    walk(dir);
    return images;
  }

  // Process all apps
  async processAllApps() {
    this.log("Converting all app images to WebP format...", "cyan");
    this.log(`Max dimension: ${MAX_SIZE}px, Quality: ${QUALITY}`, "cyan");
    this.log("", "reset");

    const apps = fs
      .readdirSync(this.appsDir)
      .filter((item) => {
        const itemPath = path.join(this.appsDir, item);
        return (
          fs.statSync(itemPath).isDirectory() &&
          item !== "_template"
        );
      });

    for (const appName of apps) {
      await this.processApp(appName);
    }

    this.log("Done!", "green");
  }

  // Main execution
  async run(appName = null) {
    if (appName) {
      await this.processApp(appName);
    } else {
      await this.processAllApps();
    }
  }
}

// CLI execution
if (require.main === module) {
  const appName = process.argv[2];
  const converter = new ImageConverter();
  converter.run(appName).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

module.exports = ImageConverter;
