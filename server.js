const express = require("express");

const path = require("path");

const cors = require("cors");

/* ========================================
Initialize App
======================================== */

const app = express();

/* ========================================
Middlewares
======================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ========================================
Static Folders
======================================== */

app.use("/css", express.static(path.join(__dirname, "css")));

app.use("/js", express.static(path.join(__dirname, "js")));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ========================================
Pages
======================================== */

/* ========================================
Static Pages
======================================== */

app.use(
express.static(
path.join(__dirname, "pages")
)
);

/* ========================================
Homepage
======================================== */

app.get("/", (req, res) => {

res.sendFile(
path.join(
__dirname,
"pages",
"index.html"
)
);

});

/* ========================================
Routes
======================================== */

const authRoutes = require("./backend/routes/auth");

const usersRoutes = require("./backend/routes/users");

const projectsRoutes = require("./backend/routes/projects");

const filesRoutes = require("./backend/routes/files");

const aiRoutes = require("./backend/routes/ai");

const settingsRoutes = require("./backend/routes/settings");

const searchRoutes = require("./backend/routes/search");

/* ========================================
API Endpoints
======================================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/projects", projectsRoutes);

app.use("/api/files", filesRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/search", searchRoutes);

/* ========================================
Main Route
======================================== */

app.get("/", (req, res) => {

res.sendFile(path.join(__dirname, "pages", "index.html"));

});

/* ========================================
404 Handler
======================================== */

app.use((req, res) => {

res.status(404).json({
success: false,
message: "Route Not Found"
});

});

/* ========================================
Start Server
======================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(
"🚀 Quavron Server Running On Port ${PORT}"
);

});
