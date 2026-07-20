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

    const regions = [
      "DZ",
      "TN",
      "FR",
      "IT",
      "ES",
      "US"
    ];


    const interests = [
      "artificial intelligence",
      "cyber security",
      "world news politics",
      "Quran",
      "Ibn Uthaymeen",
      "Abdul Salam Al Shuwaier"
    ];


    const results = [];


    for (const region of regions) {

      for (const query of interests) {

        try {

          const response = await axios.get(
            `${this.api}/search`,
            {
              params: {
                key: this.key,
                part: "snippet",
                q: query,
                type: "video",
                maxResults: 5,
                order: "relevance",
                regionCode: region
              }
            }
          );


          for (const video of response.data.items) {

            results.push(
              new ContentModel({

                id: video.id.videoId,
                externalId: video.id.videoId,

                source: "youtube",
                type: "video",

                title: video.snippet.title,

                content:
                  video.snippet.description,

                author:
                  video.snippet.channelTitle,

                url:
                  `https://youtube.com/watch?v=${video.id.videoId}`,

                thumbnail:
                  video.snippet.thumbnails?.high?.url ||
                  video.snippet.thumbnails?.default?.url,

                publishedAt:
                  video.snippet.publishedAt

              })
            );

          }


        } catch(error) {

          console.error(
            "[YouTubeConnector]",
            error.response?.data || error.message
          );

        }

      }

    }


    return results;

  }

}

module.exports = YouTubeConnector;
