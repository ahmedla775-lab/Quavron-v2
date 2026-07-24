import fs from "fs";
import path from "path";

export function exists(file) {
  return fs.existsSync(file);
}

export function read(file) {
  return fs.readFileSync(file, "utf8");
}

export function write(file, content) {
  fs.writeFileSync(file, content);
}

export function walk(dir, extensions = []) {

  let result = [];

  for (const entry of fs.readdirSync(dir)) {

    const full = path.join(dir, entry);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {

      result.push(...walk(full, extensions));

      continue;

    }

    if (
      extensions.length === 0 ||
      extensions.includes(path.extname(full))
    ) {

      result.push(full);

    }

  }

  return result;

}
