import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "../../src");

const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

const strings = new Set();

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {

    const full = path.join(dir, file);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (!EXTENSIONS.includes(path.extname(file))) {
      continue;
    }

    extract(full);

  }
}

function add(text) {

  if (!text) return;

  text = text.trim();

  if (text.length < 2) return;

  strings.add(text);

}

function extract(file) {

  const code = fs.readFileSync(file, "utf8");

  let ast;

  try {

    ast = parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript"
      ]
    });

  } catch {

    return;

  }

  traverse(ast, {

    JSXText(path) {

      add(path.node.value);

    },

    JSXAttribute(path) {

      const attrs = [
        "placeholder",
        "title",
        "alt",
        "aria-label"
      ];

      if (
        attrs.includes(path.node.name.name) &&
        path.node.value?.value
      ) {

        add(path.node.value.value);

      }

    }

  });

}

walk(ROOT);

const output = {};

for (const text of [...strings].sort()) {

  output[text] = text;

}

fs.writeFileSync(
  path.join(__dirname, "translations-found.json"),
  JSON.stringify(output, null, 2)
);

console.log("================================");
console.log("Files scanned.");
console.log("Strings:", strings.size);
console.log("================================");
