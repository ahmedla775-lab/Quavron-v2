const BaseConnector = require("../BaseConnector");

class NewsConnector extends BaseConnector {
  constructor() {
    super("news");
  }
}

module.exports = NewsConnector;
