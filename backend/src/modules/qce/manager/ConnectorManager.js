class ConnectorManager {
  constructor() {
    this.connectors = new Map();
  }

  initialize(connectors = []) {
    this.connectors.clear();

    for (const connector of connectors) {
      this.register(connector);
    }
  }

  register(connector) {
    if (!connector) return;

    const name = connector.getName();

    this.connectors.set(name, connector);
  }

  unregister(name) {
    this.connectors.delete(name);
  }

  get(name) {
    return this.connectors.get(name);
  }

  has(name) {
    return this.connectors.has(name);
  }

  list() {
    return [...this.connectors.keys()];
  }

  all() {
    return [...this.connectors.values()];
  }

  async initializeAll() {
    for (const connector of this.all()) {
      if (typeof connector.initialize === "function") {
        await connector.initialize();
      }
    }
  }

  async shutdownAll() {
    for (const connector of this.all()) {
      if (typeof connector.shutdown === "function") {
        await connector.shutdown();
      }
    }
  }

  async health() {
    const result = [];

    for (const connector of this.all()) {
      if (typeof connector.health === "function") {
        result.push(await connector.health());
      }
    }

    return result;
  }
}

module.exports = new ConnectorManager();
