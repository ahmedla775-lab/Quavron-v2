const BaseConnector = require("../BaseConnector");

class RedditConnector extends BaseConnector {
  constructor() {
    super("reddit");
  }
}

module.exports = RedditConnector;
