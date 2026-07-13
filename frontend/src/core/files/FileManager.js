import FILE_TYPES from "./FileTypes";
import FILE_TEMPLATES from "./FileTemplates";
import FileValidator from "./FileValidator";

class FileManager {

  getType(filename) {

    const extension = filename.split(".").pop()?.toLowerCase();

    return FILE_TYPES[extension] || FILE_TYPES.txt;

  }

  getTemplate(filename) {

    const extension = filename.split(".").pop()?.toLowerCase();

    return FILE_TEMPLATES[extension] ?? "";

  }

  createFile(name, parentId = null) {

    const validation = FileValidator.validateName(name);

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const type = this.getType(name);

    return {
      name,
      type: type.language,
      icon: type.icon,
      parent_id: parentId,
      content: this.getTemplate(name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

  }

  createFolder(name, parentId = null) {

    const validation = FileValidator.validateName(name);

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    return {
      name,
      type: "folder",
      icon: "folder",
      parent_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

  }

}

export default new FileManager();
