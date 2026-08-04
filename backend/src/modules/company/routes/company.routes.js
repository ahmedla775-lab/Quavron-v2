const express = require("express");
const controller = require("../controllers/company.controller");

const router = express.Router();

router.get("/feed", controller.feed);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

module.exports = router;
