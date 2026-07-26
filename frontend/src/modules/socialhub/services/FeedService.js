import SocialAggregator from "./SocialAggregator";
import YouTubeService from "./YouTubeService";

class FeedService {

  constructor() {
    SocialAggregator.register("youtube", YouTubeService);
  }


  async getFeed(options = {}) {

    const response = await fetch(
      "http://192.168.254.31:5000/api/qce/feed"
    );

    const result = await response.json();

    return result.data || [];

  }

}

export default new FeedService();
