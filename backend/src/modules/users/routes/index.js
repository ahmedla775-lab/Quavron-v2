const router = require("express").Router();

const UserController =
require("../controllers/UserController");

router.get(
  "/id/:id",
  UserController.profile
);

router.get(
  "/username/:username",
  UserController.username
);

module.exports = router;
