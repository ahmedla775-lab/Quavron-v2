import { SOURCES, SOURCE_TYPES } from "../constants/sources";

class YouTubeService {
  async fetch() {
    return [
      {
        id: crypto.randomUUID(),
        source: SOURCES.YOUTUBE,
        type: SOURCE_TYPES.VIDEO,

        externalId: "demo-video-1",

        title: "Welcome to Quavron Social Hub",
        content: "Demo video returned from YouTubeService.",

        thumbnail: "https://placehold.co/1280x720",
        media: "",

        author: "Quavron",
        authorAvatar: "",
        authorUrl: "",

        url: "https://youtube.com",

        tags: ["demo", "youtube"],

        language: "en",

        likes: 0,
        comments: 0,
        views: 0,

        publishedAt: new Date().toISOString(),
      },
    ];
  }
}

export default new YouTubeService();
