import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "translations-found.json"),
    "utf8"
  )
);

const output = {};

function makeKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

for (const text of Object.keys(source)) {
  const key = makeKey(text);

  output[key] = text;
}

fs.writeFileSync(
  path.join(__dirname, "translation-template.json"),
  JSON.stringify(output, null, 2)
);

console.log("Generated", Object.keys(output).length, "translation keys.");
