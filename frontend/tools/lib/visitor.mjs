import traverse from "@babel/traverse";

export function visit(ast, visitors) {
  traverse.default(ast, visitors);
}
