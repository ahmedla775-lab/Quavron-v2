const FollowService = require("../services/FollowService");

class FollowController {

  async follow(req, res) {
    try {
      const result = await FollowService.follow(
        req.body.followerId,
        req.body.followingId
      );
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async unfollow(req, res) {
    try {
      const result = await FollowService.unfollow(
        req.body.followerId,
        req.body.followingId
      );
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async status(req, res) {
    try {
      const following = await FollowService.isFollowing(
        req.params.follower,
        req.params.following
      );

      res.json({ following });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async followers(req, res) {
    try {
      const data = await FollowService.getFollowers(req.params.id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async following(req, res) {
    try {
      const data = await FollowService.getFollowing(req.params.id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

}

module.exports = new FollowController();

