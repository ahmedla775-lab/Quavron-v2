import path from "path";
import { fileURLToPath } from "url";

import { info, success } from "../lib/logger.mjs";
import { scanReact } from "../lib/scanner.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(
  __dirname,
  "../../src"
);

info("Scanning project...");

const files = scanReact(root);

success(`${files.length} React files found.`);

console.log("");

for (const file of files.slice(0, 20)) {

  console.log(file);

}

if (files.length > 20) {

  console.log("");
  console.log(`... ${files.length - 20} more`);

}
