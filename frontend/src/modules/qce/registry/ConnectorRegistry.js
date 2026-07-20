class ConnectorRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(name, connector) {
    if (this.registry.has(name)) {
      throw new Error(`Connector '${name}' already registered.`);
    }

    this.registry.set(name, connector);
  }

  unregister(name) {
    this.registry.delete(name);
  }

  has(name) {
    return this.registry.has(name);
  }

  get(name) {
    return this.registry.get(name);
  }

  getAll() {
    return Array.from(this.registry.values());
  }

  getNames() {
    return Array.from(this.registry.keys());
  }

  clear() {
    this.registry.clear();
  }
}

export default new ConnectorRegistry();
