const ConnectorManager = require("../manager/ConnectorManager");
const ContentNormalizer = require("../normalizer/ContentNormalizer");
class ContentPipeline {

  async feed(options = {}) {

    const connectors = ConnectorManager.all();

    const results = [];

    for (const connector of connectors) {

      try {

        const items = await connector.fetchFeed(options);

        if (Array.isArray(items)) {
          results.push(...items);
        }

      } catch (error) {

        console.error(
          `[QCE] ${connector.getName()}`,
          error.message
        );

      }

    }

    return ContentNormalizer.normalizeMany(results);
  }


  async trending(options = {}) {

    const connectors = ConnectorManager.all();

    const results = [];

    for (const connector of connectors) {

      try {

        const items = await connector.fetchTrending(options);

        if (Array.isArray(items)) {
          results.push(...items);
        }

      } catch (error) {

        console.error(
          `[QCE] ${connector.getName()}`,
          error.message
        );

      }

    }

    return ContentNormalizer.normalizeMany(results);
  }

}

module.exports = new ContentPipeline();
