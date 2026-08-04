const UserService = require("../../users/services/UserService");

class UserPreferenceService {

  async getPreferences(userId) {

    if (!userId) {
      return {
        interests: [],
        platforms: [],
        languages: []
      };
    }

    try {

      const profile =
        await UserService.getProfile(userId);

      const interests = [];

      if (profile.bio) {

        const words =
          profile.bio
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 3);

        interests.push(...words);
      }

      return {

        interests: [...new Set(interests)],

        platforms: [],

        languages: []

      };

    } catch (error) {

      return {
        interests: [],
        platforms: [],
        languages: []
      };

    }
  }

}

module.exports = new UserPreferenceService();
