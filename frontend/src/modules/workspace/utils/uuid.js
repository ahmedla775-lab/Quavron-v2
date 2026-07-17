export function generateId(prefix = "node") {

  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {

    return `${prefix}-${crypto.randomUUID()}`;

  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)}`;

}

export function createFile({

  name,

  content = "",

  language = "plaintext",

}) {

  const now = new Date().toISOString();

  return {

    id: generateId("file"),

    type: "file",

    name,

    content,

    language,

    createdAt: now,

    updatedAt: now,

  };

}

export function createFolder(name) {

  const now = new Date().toISOString();

  return {

    id: generateId("folder"),

    type: "folder",

    name,

    children: [],

    createdAt: now,

    updatedAt: now,

  };

}
