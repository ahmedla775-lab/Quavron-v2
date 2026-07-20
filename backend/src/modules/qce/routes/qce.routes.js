const express = require("express");

const QCEController = require("../controllers/QCEController");

const router = express.Router();

router.get("/feed", QCEController.feed);

router.get("/trending", QCEController.trending);

router.get("/search", QCEController.search);

module.exports = router;
