class FileManager {

  constructor(treeManager) {

    this.treeManager = treeManager;

  }

  open(fileId) {

    return this.treeManager.getNode(fileId);

  }

  save(fileId, content) {

    const file =
      this.treeManager.getNode(fileId);

    if (!file || file.type !== "file") {

      return null;

    }

    file.content = content;

    file.updatedAt =
      new Date().toISOString();

    return file;

  }

  rename(fileId, newName) {

    this.treeManager.rename(

      fileId,

      newName

    );

    return this.treeManager.getNode(fileId);

  }

  delete(fileId) {

    this.treeManager.delete(fileId);

  }

  changeLanguage(fileId, language) {

    const file =
      this.treeManager.getNode(fileId);

    if (!file || file.type !== "file") {

      return null;

    }

    file.language = language;

    file.updatedAt =
      new Date().toISOString();

    return file;

  }

  duplicate(fileId) {

    const file =
      this.treeManager.getNode(fileId);

    if (!file || file.type !== "file") {

      return null;

    }

    const extension =

      file.name.includes(".")

        ? file.name.substring(

            file.name.lastIndexOf(".")

          )

        : "";

    const baseName =

      extension

        ? file.name.replace(

            extension,

            ""

          )

        : file.name;

    return this.treeManager.createFile(

      null,

      `${baseName} Copy${extension}`,

      {

        content: file.content,

        language: file.language,

      }

    );

  }

  updateContent(fileId, content) {

    return this.save(

      fileId,

      content

    );

  }

  updateMetadata(fileId, data = {}) {

    const file =
      this.treeManager.getNode(fileId);

    if (!file || file.type !== "file") {

      return null;

    }

    Object.assign(

      file,

      data

    );

    file.updatedAt =
      new Date().toISOString();

    return file;

  }

}

export default FileManager;
