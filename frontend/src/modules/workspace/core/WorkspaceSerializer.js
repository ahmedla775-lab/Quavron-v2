class WorkspaceSerializer {

  static export(workspace) {

    return JSON.stringify(

      workspace,

      null,

      2

    );

  }

  static import(serialized) {

    try {

      return JSON.parse(serialized);

    }

    catch {

      return null;

    }

  }

  static clone(workspace) {

    return JSON.parse(

      JSON.stringify(workspace)

    );

  }

  static saveLocal(key, workspace) {

    localStorage.setItem(

      key,

      this.export(workspace)

    );

  }

  static loadLocal(key) {

    const data =

      localStorage.getItem(key);

    if (!data) {

      return null;

    }

    return this.import(data);

  }

  static clearLocal(key) {

    localStorage.removeItem(key);

  }

}

export default WorkspaceSerializer;
