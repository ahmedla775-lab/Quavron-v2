import path from "path";
import { walk } from "./filesystem.mjs";

export function scanReact(root) {

  return walk(root, [
    ".js",
    ".jsx",
    ".ts",
    ".tsx"
  ]).filter(file => {

    return !file.includes(
      `${path.sep}node_modules${path.sep}`
    );

  });

}
