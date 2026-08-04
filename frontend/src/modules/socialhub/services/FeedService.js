import SocialAggregator from "./SocialAggregator";
import YouTubeService from "./YouTubeService";

class FeedService {

  constructor() {
    SocialAggregator.register("youtube", YouTubeService);
  }

  async getFeed(userId = null, options = {}) {

    const base =
      import.meta.env.VITE_QCE_URL || "http://localhost:5000";

    const endpoint = userId
      ? `${base}/api/qce/feed/${userId}`
      : `${base}/api/qce/feed`;

    const response = await fetch(endpoint);

    const result = await response.json();

    return result.data || result || [];
  }
}

export default new FeedService();
