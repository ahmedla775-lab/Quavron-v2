const express = require("express");

const qceRoutes = require("../modules/qce/routes/qce.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    name: "Quavron API",
    version: "1.0.0",
    status: "Running 🚀",
  });
});

router.use("/api/qce", qceRoutes);

module.exports = router;
