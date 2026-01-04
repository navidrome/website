#!/usr/bin/env node

/**
 * Convert Images Script
 *
 * Converts PNG/JPG images to WebP format across the website
 * - static/screenshots/
 * - content/en/ page bundle images
 *
 * Usage: node convert-docs-images.js [--dry-run]
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const QUALITY = 80;

// Detect if running in CI environment
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

// Color codes for terminal output (disabled in CI)
const colors = isCI
  ? { reset: "", red: "", green: "", yellow: "", blue: "", cyan: "", dim: "" }
  : {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      cyan: "\x1b[36m",
      dim: "\x1b[2m",
    };

const dryRun = process.argv.includes("--dry-run");

// Directories to process
const DIRECTORIES = [
  path.join(process.cwd(), "static", "screenshots"),
  path.join(process.cwd(), "content", "en"),
];

// Directories to exclude (in addition to tmp/)
const EXCLUDE_DIRS = ["tmp", "node_modules", "themes", "favicons"];

// Files to exclude (Hugo/Docsy requires these to remain in original format)
const EXCLUDE_FILES = ["featured-background", "background"];

function log(message, color = "reset") {
  if (isCI) {
    console.log(message);
  } else {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

async function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function convertImage(inputFile) {
  const ext = path.extname(inputFile).toLowerCase();

  // Skip if not a convertible format
  if (![".png", ".jpg", ".jpeg"].includes(ext)) {
    return null;
  }

  const outputFile = inputFile.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const originalSize = await getFileSize(inputFile);

  log(`  Converting: ${path.relative(process.cwd(), inputFile)}`, "cyan");

  if (dryRun) {
    log(
      `    [DRY RUN] Would convert to: ${path.relative(
        process.cwd(),
        outputFile
      )}`,
      "yellow"
    );
    return { input: inputFile, output: outputFile, originalSize, newSize: 0 };
  }

  try {
    await sharp(inputFile).webp({ quality: QUALITY }).toFile(outputFile);

    const newSize = await getFileSize(outputFile);

    // Remove original file
    fs.unlinkSync(inputFile);

    log(`    ✓ Converted to: ${path.basename(outputFile)}`, "green");
    return { input: inputFile, output: outputFile, originalSize, newSize };
  } catch (err) {
    log(`    ✗ Error: ${err.message}`, "red");
    return null;
  }
}

function findImages(dir, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip excluded directories
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) {
        continue;
      }
      findImages(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const basename = path.basename(entry.name, ext);
      // Skip excluded files (e.g., background images used by Hugo/Docsy)
      const isExcluded = EXCLUDE_FILES.some((pattern) =>
        basename.includes(pattern)
      );
      if ([".png", ".jpg", ".jpeg"].includes(ext) && !isExcluded) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function updateReferences(conversions) {
  if (conversions.length === 0) return;

  log("\nUpdating file references...", "blue");

  // Find all markdown and HTML files that might reference images
  const contentDir = path.join(process.cwd(), "content");
  const markdownFiles = findMarkdownFiles(contentDir);

  for (const mdFile of markdownFiles) {
    let content = fs.readFileSync(mdFile, "utf8");
    let modified = false;

    for (const { input, output } of conversions) {
      // Get relative paths for replacement
      const oldBasename = path.basename(input);
      const newBasename = path.basename(output);

      // Also handle paths relative to static/
      const oldStaticPath = input.includes("/static/")
        ? "/" + path.relative(path.join(process.cwd(), "static"), input)
        : null;
      const newStaticPath = oldStaticPath
        ? oldStaticPath.replace(/\.(png|jpg|jpeg)$/i, ".webp")
        : null;

      // Replace basename references (for page bundle images)
      if (content.includes(oldBasename)) {
        content = content.replace(
          new RegExp(escapeRegExp(oldBasename), "g"),
          newBasename
        );
        modified = true;
      }

      // Replace static path references (for /screenshots/ etc)
      if (oldStaticPath && content.includes(oldStaticPath)) {
        content = content.replace(
          new RegExp(escapeRegExp(oldStaticPath), "g"),
          newStaticPath
        );
        modified = true;
      }
    }

    if (modified && !dryRun) {
      fs.writeFileSync(mdFile, content, "utf8");
      log(`  ✓ Updated: ${path.relative(process.cwd(), mdFile)}`, "green");
    } else if (modified && dryRun) {
      log(
        `  [DRY RUN] Would update: ${path.relative(process.cwd(), mdFile)}`,
        "yellow"
      );
    }
  }
}

function findMarkdownFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        findMarkdownFiles(fullPath, results);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".md", ".html"].includes(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function printComparisonTable(conversions) {
  if (conversions.length === 0 || dryRun) return;

  log("\n" + "=".repeat(80), "blue");
  log("Image Size Comparison", "blue");
  log("=".repeat(80), "blue");

  // Table header
  const colFile = 40;
  const colOrig = 12;
  const colNew = 12;
  const colRed = 10;

  const header = [
    "File".padEnd(colFile),
    "Original".padStart(colOrig),
    "WebP".padStart(colNew),
    "Reduction".padStart(colRed),
  ].join(" │ ");

  log("┌" + "─".repeat(header.length + 2) + "┐", "dim");
  log("│ " + header + " │", "blue");
  log("├" + "─".repeat(header.length + 2) + "┤", "dim");

  let totalOriginal = 0;
  let totalNew = 0;

  for (const { input, originalSize, newSize } of conversions) {
    const filename = path.basename(input, path.extname(input));
    const reduction =
      originalSize > 0 ? ((1 - newSize / originalSize) * 100).toFixed(1) : 0;

    totalOriginal += originalSize;
    totalNew += newSize;

    const row = [
      filename.substring(0, colFile).padEnd(colFile),
      formatSize(originalSize).padStart(colOrig),
      formatSize(newSize).padStart(colNew),
      `${reduction}%`.padStart(colRed),
    ].join(" │ ");

    log("│ " + row + " │");
  }

  log("├" + "─".repeat(header.length + 2) + "┤", "dim");

  // Totals row
  const totalReduction =
    totalOriginal > 0 ? ((1 - totalNew / totalOriginal) * 100).toFixed(1) : 0;
  const totalsRow = [
    "TOTAL".padEnd(colFile),
    formatSize(totalOriginal).padStart(colOrig),
    formatSize(totalNew).padStart(colNew),
    `${totalReduction}%`.padStart(colRed),
  ].join(" │ ");

  log("│ " + totalsRow + " │", "green");
  log("└" + "─".repeat(header.length + 2) + "┘", "dim");

  // Summary
  const saved = totalOriginal - totalNew;
  log(
    `\nSpace saved: ${formatSize(saved)} (${totalReduction}% reduction)`,
    "green"
  );
}

async function main() {
  log("=".repeat(60), "blue");
  log("Image Conversion Script", "blue");
  log("=".repeat(60), "blue");

  if (dryRun) {
    log("\n[DRY RUN MODE] No files will be modified\n", "yellow");
  }

  const allImages = [];

  for (const dir of DIRECTORIES) {
    log(`\nScanning: ${path.relative(process.cwd(), dir) || dir}`, "blue");
    const images = findImages(dir);
    allImages.push(...images);
    log(`  Found ${images.length} images`, "cyan");
  }

  if (allImages.length === 0) {
    log("\nNo PNG/JPG images found to convert.", "green");
    return;
  }

  log(`\nTotal images to convert: ${allImages.length}`, "blue");
  log("-".repeat(60), "blue");

  const conversions = [];

  for (const imagePath of allImages) {
    const result = await convertImage(imagePath);
    if (result) {
      conversions.push(result);
    }
  }

  // Update references in markdown files
  await updateReferences(conversions);

  // Print comparison table
  printComparisonTable(conversions);

  log("\n" + "=".repeat(60), "blue");
  log(`Conversion complete! ${conversions.length} images processed.`, "green");
  log("=".repeat(60), "blue");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
