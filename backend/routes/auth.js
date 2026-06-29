const express = require("express");

const router = express.Router();

/* ========================================
Login
======================================== */

router.post("/login", (req, res) => {

res.json({
success: true,
message: "Login API Ready"
});

});

/* ========================================
Register
======================================== */

router.post("/register", (req, res) => {

res.json({
success: true,
message: "Register API Ready"
});

});

/* ========================================
Logout
======================================== */

router.post("/logout", (req, res) => {

res.json({
success: true,
message: "Logout API Ready"
});

});

module.exports = router;
