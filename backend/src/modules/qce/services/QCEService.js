const Pipeline = require("../pipeline");

class QCEService {
  async getFeed(options = {}) {
    return Pipeline.feed(options);
  }

  async getTrending(options = {}) {
  return Pipeline.trending(options);
}
  async search(query, options = {}) {
    return [];
  }
}

module.exports = new QCEService();
