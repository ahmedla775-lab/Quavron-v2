class BaseConnector {
  constructor(source) {
    this.source = source;
  }

  getName() {
    return this.source;
  }

  async initialize() {}

  async shutdown() {}

  async health() {
    return {
      source: this.source,
      status: "ready",
    };
  }

  async fetchFeed(options = {}) {
    return [];
  }

  async fetchTrending(options = {}) {
    return [];
  }

  async fetchLatest(options = {}) {
    return [];
  }

  async fetchByCategory(category, options = {}) {
    return [];
  }

  async fetchBySearch(query, options = {}) {
    return [];
  }

  async fetchByLanguage(language, options = {}) {
    return [];
  }

  normalize(content) {
    return content;
  }
}

module.exports = BaseConnector;
