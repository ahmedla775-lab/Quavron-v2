const YouTubeConnector = require("./youtube/YouTubeConnector");
const XConnector = require("./x/XConnector");
const TikTokConnector = require("./tiktok/TikTokConnector");
const FacebookConnector = require("./facebook/FacebookConnector");
const InstagramConnector = require("./instagram/InstagramConnector");
const RedditConnector = require("./reddit/RedditConnector");
const GitHubConnector = require("./github/GitHubConnector");
const NewsConnector = require("./news/NewsConnector");
const RSSConnector = require("./rss/RSSConnector");

module.exports = [
  new YouTubeConnector(),
  new XConnector(),
  new TikTokConnector(),
  new FacebookConnector(),
  new InstagramConnector(),
  new RedditConnector(),
  new GitHubConnector(),
  new NewsConnector(),
  new RSSConnector(),
];
