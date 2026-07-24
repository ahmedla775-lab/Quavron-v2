import { getProjectStatistics } from "../lib/statistics.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { info, success, warning } from "../lib/logger.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, "../../");

info("Running Quavron Doctor...\n");

const checks = [
  "package.json",
  "vite.config.js",
  "src",
  "public",
  "tools",
  "src/main.jsx",
  "src/App.jsx",
  "src/i18n.js",
];

let ok = 0;
let fail = 0;

for (const file of checks) {

  const full = path.join(root, file);

  if (fs.existsSync(full)) {

    success(file);
    ok++;

  } else {

    warning(`Missing: ${file}`);
    fail++;

  }

}

console.log("");

console.log("Project Summary");
console.log("--------------------------");
console.log(`Passed : ${ok}`);
console.log(`Missing: ${fail}`);

const stats = getProjectStatistics(root);

console.log("");

console.log("Project Statistics");
console.log("--------------------------");

console.log(`Pages      : ${stats.pages}`);
console.log(`Components : ${stats.components}`);
console.log(`Contexts   : ${stats.contexts}`);
console.log(`Hooks      : ${stats.hooks}`);
console.log(`Locales    : ${stats.locales}`);
console.log(`Services   : ${stats.services}`);
console.log(`Utils      : ${stats.utils}`);
