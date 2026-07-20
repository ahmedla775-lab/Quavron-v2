import ConnectorRegistry from "../registry";

class ContentAggregator {
  async fetchTrending(options = {}) {
    const connectors = ConnectorRegistry.getAll();

    const results = [];

    for (const connector of connectors) {
      try {
        const items = await connector.fetchTrending(options);

        if (Array.isArray(items)) {
          results.push(...items);
        }
      } catch (error) {
        console.error(
          `[QCE] ${connector.source} fetchTrending failed`,
          error
        );
      }
    }

    return results;
  }

  async fetchLatest(options = {}) {
    const connectors = ConnectorRegistry.getAll();

    const results = [];

    for (const connector of connectors) {
      try {
        const items = await connector.fetchLatest(options);

        if (Array.isArray(items)) {
          results.push(...items);
        }
      } catch (error) {
        console.error(
          `[QCE] ${connector.source} fetchLatest failed`,
          error
        );
      }
    }

    return results;
  }
}

export default new ContentAggregator();
