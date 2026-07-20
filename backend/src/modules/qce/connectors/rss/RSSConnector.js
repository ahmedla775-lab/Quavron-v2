const BaseConnector = require("../BaseConnector");
const Parser = require("rss-parser");

const parser = new Parser();

class RSSConnector extends BaseConnector {

  constructor() {
    super("rss");
  }


  async fetchFeed(options = {}) {

    const feeds = [
      "https://feeds.bbci.co.uk/news/rss.xml",
      "https://github.blog/feed/"
    ];

    const results = [];

    for (const url of feeds) {

      try {

        const feed = await parser.parseURL(url);

        for (const item of feed.items) {

          results.push({
            id: item.guid || item.link,
            source: "rss",
            type: "article",
            title: item.title || "",
            description:
              item.contentSnippet ||
              item.content ||
              "",
            url: item.link || "",
            author: item.creator || feed.title,
            createdAt:
              item.pubDate ||
              new Date().toISOString()
          });

        }

      } catch (error) {

        console.error(
          "[RSS]",
          url,
          error.message
        );

      }

    }

    return results;
  }


  async fetchTrending(options = {}) {
    return this.fetchFeed(options);
  }

}

module.exports = RSSConnector;
