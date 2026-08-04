const express = require("express");

const qceRoutes = require("../modules/qce/routes/qce.routes");
const userRoutes = require("../modules/users/routes");
const followRoutes = require("../modules/follow/routes");

const companyRoutes = require("../modules/company/routes/company.routes");

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
router.use("/api/users", userRoutes);
router.use("/api/follow", followRoutes);

router.use("/api/company", companyRoutes);

module.exports = router;
