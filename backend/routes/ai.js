const express = require("express");

const router = express.Router();

/* ========================================
AI Request
======================================== */

router.post("/generate", (req, res) => {

res.json({
success: true,
message: "AI System Ready"
});

});

module.exports = router;
