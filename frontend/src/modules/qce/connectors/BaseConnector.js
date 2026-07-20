export default class BaseConnector {
  constructor(source) {
    this.source = source;
  }

  async fetchTrending() {
    throw new Error("fetchTrending() not implemented.");
  }

  async fetchLatest() {
    throw new Error("fetchLatest() not implemented.");
  }

  async fetchByCategory() {
    throw new Error("fetchByCategory() not implemented.");
  }

  async fetchBySearch() {
    throw new Error("fetchBySearch() not implemented.");
  }

  async fetchByLanguage() {
    throw new Error("fetchByLanguage() not implemented.");
  }

  normalize() {
    throw new Error("normalize() not implemented.");
  }
}
