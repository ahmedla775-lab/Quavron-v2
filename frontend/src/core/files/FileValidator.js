const INVALID_CHARACTERS = /[\\/:*?"<>|]/;

class FileValidator {

  validateName(name) {

    if (!name || !name.trim()) {
      return {
        valid: false,
        message: "File name is required.",
      };
    }

    if (INVALID_CHARACTERS.test(name)) {
      return {
        valid: false,
        message: "File name contains invalid characters.",
      };
    }

    return {
      valid: true,
      message: "",
    };

  }

  alreadyExists(files, name, parentId = null) {

    return files.some(
      (file) =>
        file.name === name &&
        (file.parent_id ?? null) === parentId
    );

  }

}

export default new FileValidator();
