export function findNode(tree, id) {

  for (const node of tree) {

    if (node.id === id) {

      return node;

    }

    if (node.type === "folder" && node.children?.length) {

      const result = findNode(node.children, id);

      if (result) {

        return result;

      }

    }

  }

  return null;

}

export function addNode(tree, parentId, newNode) {

  if (!parentId) {

    return [...tree, newNode];

  }

  return tree.map((node) => {

    if (node.id === parentId && node.type === "folder") {

      return {

        ...node,

        children: [

          ...(node.children || []),

          newNode,

        ],

      };

    }

    if (node.type === "folder") {

      return {

        ...node,

        children: addNode(

          node.children || [],

          parentId,

          newNode

        ),

      };

    }

    return node;

  });

}

export function renameNode(tree, id, newName) {

  return tree.map((node) => {

    if (node.id === id) {

      return {

        ...node,

        name: newName,

        updatedAt: new Date().toISOString(),

      };

    }

    if (node.type === "folder") {

      return {

        ...node,

        children: renameNode(

          node.children || [],

          id,

          newName

        ),

      };

    }

    return node;

  });

}

export function removeNode(tree, id) {

  return tree

    .filter((node) => node.id !== id)

    .map((node) => {

      if (node.type === "folder") {

        return {

          ...node,

          children: removeNode(

            node.children || [],

            id

          ),

        };

      }

      return node;

    });

}

export function flattenTree(tree) {

  let result = [];

  for (const node of tree) {

    result.push(node);

    if (node.type === "folder") {

      result = result.concat(

        flattenTree(node.children || [])

      );

    }

  }

  return result;

}
