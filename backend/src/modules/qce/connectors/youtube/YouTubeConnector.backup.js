const axios = require("axios");
const BaseConnector = require("../BaseConnector");
const ContentModel = require("../../types/ContentModel");
class YouTubeConnector extends BaseConnector {
  constructor() {
    super("youtube");

    this.api = "https://www.googleapis.com/youtube/v3";
    this.key = process.env.YOUTUBE_API_KEY;
  }

  async fetchFeed(options = {}) {
    return this.fetchTrending(options);
  }

  async fetchTrending(options = {}) {
    try {
      const response = await axios.get(
        `${this.api}/videos`,
        {
          params: {
            key: this.key,
            part: "snippet,statistics",
            chart: "mostPopular",
            maxResults: options.limit || 20,
            regionCode: options.region || "US"
          }
        }
      );

      return response.data.items.map(video => new ContentModel({
  id: video.id,
  externalId: video.id,

  source: "youtube",
  type: "video",

  title: video.snippet.title,
  content: video.snippet.description,

  author: video.snippet.channelTitle,

  url: `https://www.youtube.com/watch?v=${video.id}`,

  thumbnail:
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.default?.url,

  views: Number(video.statistics?.viewCount || 0),
  likes: Number(video.statistics?.likeCount || 0),
  comments: Number(video.statistics?.commentCount || 0),

  publishedAt: video.snippet.publishedAt
}));
    } catch (err) {

      console.error(
        "[YouTubeConnector]",
        err.response?.data || err.message
      );

      return [];
    }
  }
}

module.exports = YouTubeConnector;
