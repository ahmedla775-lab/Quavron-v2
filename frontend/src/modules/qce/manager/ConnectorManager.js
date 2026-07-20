import ConnectorRegistry from "../registry";

class ConnectorManager {
  initialize(connectors = []) {
    ConnectorRegistry.clear();

    for (const connector of connectors) {
      ConnectorRegistry.register(
        connector.source,
        connector
      );
    }
  }

  add(connector) {
    ConnectorRegistry.register(
      connector.source,
      connector
    );
  }

  remove(source) {
    ConnectorRegistry.unregister(source);
  }

  has(source) {
    return ConnectorRegistry.has(source);
  }

  get(source) {
    return ConnectorRegistry.get(source);
  }

  list() {
    return ConnectorRegistry.getNames();
  }
}

export default new ConnectorManager();
