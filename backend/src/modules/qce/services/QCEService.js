const Pipeline = require("../pipeline");
const RankingEngine = require("../ranking/RankingEngine");
const UserPreferenceService = require("../preferences/UserPreferenceService");

class QCEService {
  async getFeed(options = {}) {
    return Pipeline.feed(options);
  }

  async getTrending(options = {}) {
  return Pipeline.trending(options);
}
  async search(query, options = {}) {
    return [];
  }

  async getPersonalFeed(userId, options = {}) {

    const feed = await Pipeline.feed({
      ...options,
      userId,
    });

    const preferences =
      await UserPreferenceService.getPreferences(userId);

    return RankingEngine.rank(
      feed,
      preferences
    );
  }
}

module.exports = new QCEService();
