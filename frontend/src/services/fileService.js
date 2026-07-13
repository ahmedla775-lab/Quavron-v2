class FileService {
  constructor() {
    this.files = [];
    this.currentFile = null;
  }

  getFiles() {
    return this.files;
  }

  openFile(file) {
    this.currentFile = file;
    return file;
  }

  getCurrentFile() {
    return this.currentFile;
  }

  saveFile(content) {
    if (!this.currentFile) return false;

    this.currentFile.content = content;

    return true;
  }

  createFile(name) {
    const file = {
      id: Date.now(),
      name,
      content: "",
    };

    this.files.push(file);

    return file;
  }

  deleteFile(id) {
    this.files = this.files.filter(
      file => file.id !== id
    );
  }
}

export default new FileService();

