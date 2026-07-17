export function searchTree(tree, query) {

  if (!query || !query.trim()) {

    return tree;

  }

  const keyword =
    query.toLowerCase();

  function visit(nodes) {

    const result = [];

    for (const node of nodes) {

      const matched = node.name
        .toLowerCase()
        .includes(keyword);

      let children = [];

      if (
        node.type === "folder" &&
        node.children
      ) {

        children = visit(
          node.children
        );

      }

      if (
        matched ||
        children.length
      ) {

        result.push({

          ...node,

          open: true,

          children,

        });

      }

    }

    return result;

  }

  return visit(tree);

}
