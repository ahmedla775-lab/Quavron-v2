const express = require("express");

const cors = require("cors");

const morgan = require("morgan");

require("dotenv").config();

/* ========================================
ROUTES
======================================== */

const authRoutes =
require("./routes/auth");

/* ========================================
APP
======================================== */

const app = express();

/* ========================================
MIDDLEWARE
======================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({

extended: true

}));

app.use(morgan("dev"));

/* ========================================
ROOT
======================================== */

app.get("/", (req, res) => {

res.json({

success: true,

message: "Quavron Running 🚀"

});

});

/* ========================================
AUTH ROUTES
======================================== */

app.use(

"/api/auth",

authRoutes

);

/* ========================================
EXPORT
======================================== */

module.exports = app;
