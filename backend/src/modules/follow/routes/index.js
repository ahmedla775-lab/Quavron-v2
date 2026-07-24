const router = require("express").Router();

const controller =
require("../controllers/FollowController");

router.post("/follow", controller.follow);

router.post("/unfollow", controller.unfollow);

router.get(
  "/followers/:id",
  controller.followers
);

router.get(
  "/following/:id",
  controller.following
);
router.get(
  "/status/:follower/:following",
  controller.status
);

module.exports = router;

