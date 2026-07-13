class ProjectService {
  constructor() {
    this.project = {
      id: "default-project",
      name: "Quavron Project",
      path: "/",
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getProject() {
    return this.project;
  }

  setProject(project) {
    this.project = {
      ...this.project,
      ...project,
      updatedAt: new Date(),
    };
  }

  updateFiles(files) {
    this.project.files = files;
    this.project.updatedAt = new Date();
  }

  renameProject(name) {
    this.project.name = name;
    this.project.updatedAt = new Date();
  }
}

const projectService = new ProjectService();

export default projectService;

