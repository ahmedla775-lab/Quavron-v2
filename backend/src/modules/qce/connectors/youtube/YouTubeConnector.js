const Parser = require("rss-parser");
const BaseConnector = require("../BaseConnector");
const ContentModel = require("../../types/ContentModel");

const channels = require("./channelFeeds.json");

class YouTubeConnector extends BaseConnector {
  constructor() {
    super("youtube");
    this.parser = new Parser();
  }

  async fetchFeed(options = {}) {
    return this.fetchTrending(options);
  }

  async fetchTrending(options = {}) {
    const results = [];

    for (const channel of channels) {
      try {
        const feed = await this.parser.parseURL(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`
        );

        for (const item of (feed.items || []).slice(0, 5)) {
          results.push(
            new ContentModel({
              id: item.id,
              externalId: item.id,

              source: "youtube",
              type: "video",

              title: item.title,
              content: item.contentSnippet || "",
              author: feed.title,

              url: item.link,

              thumbnail:
                item.mediaThumbnail?.url ||
                item.enclosure?.url ||
                "",

              publishedAt: item.pubDate,
            })
          );
        }
      } catch (error) {
        console.error(
          `[YouTube RSS] ${channel.name}`,
          error.message
        );
      }
    }

    console.log("[YouTube] videos:", results.length);

    return results;
  }
}

module.exports = YouTubeConnector;
