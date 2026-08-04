class ModuleRegistry {

  constructor() {

    this.modules = new Map();

  }

  register(module) {

    if (!module?.id) {

      throw new Error("Module must have an id.");

    }

    this.modules.set(module.id, module);

  }

  get(id) {

    return this.modules.get(id) ?? null;

  }

  getAll() {

    return [...this.modules.values()];

  }

  has(id) {

    return this.modules.has(id);

  }

}

const registry = new ModuleRegistry();

export default registry;
