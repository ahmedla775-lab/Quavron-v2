import { parse } from "@babel/parser";

export function parseCode(code) {
  return parse(code, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript"
    ]
  });
}
