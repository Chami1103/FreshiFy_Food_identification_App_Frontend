/**
 * Simple utility script to validate SVG icons are correctly imported
 * Run using: `node scripts/sync-icons.js`
 */

const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "../components/icons");
const OUT_FILE = path.join(ICONS_DIR, "index.ts");

const files = fs
  .readdirSync(ICONS_DIR)
  .filter((f) => f.endsWith(".tsx") && f !== "index.ts");

const exports = files
  .map((file) => `export * from "./${path.basename(file, ".tsx")}";`)
  .join("\n");

fs.writeFileSync(OUT_FILE, exports);
console.log(`✅ Synced ${files.length} icon files to index.ts`);
