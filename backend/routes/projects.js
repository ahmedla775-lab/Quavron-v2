const express = require("express");

const router = express.Router();

/* ========================================
TEMP PROJECTS STORAGE
======================================== */

let projects = [

{
id: 1,
name: "Quavron IDE",
language: "TypeScript",
framework: "Next.js",
favorite: true,
visibility: "public",
status: "active",
createdAt: new Date()
},

{
id: 2,
name: "Portfolio Website",
language: "JavaScript",
framework: "React",
favorite: false,
visibility: "private",
status: "active",
createdAt: new Date()
}

];

/* ========================================
GET ALL PROJECTS
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: projects.length,

projects

});

});

/* ========================================
GET SINGLE PROJECT
======================================== */

router.get("/:id", (req, res) => {

const project =
projects.find(
item => item.id == req.params.id
);

if (!project) {

return res.status(404).json({

  success: false,

  message: "Project Not Found"

});

}

res.json({

success: true,

project

});

});

/* ========================================
CREATE PROJECT
======================================== */

router.post("/create", (req, res) => {

const {

name,

language,

framework,

visibility

} = req.body;

if (!name) {

return res.status(400).json({

  success: false,

  message: "Project name required"

});

}

const newProject = {

id: Date.now(),

name,

language: language || "JavaScript",

framework: framework || "Vanilla",

favorite: false,

visibility: visibility || "private",

status: "active",

createdAt: new Date()

};

projects.unshift(newProject);

res.json({

success: true,

message: "Project created successfully",

project: newProject

});

});

/* ========================================
UPDATE PROJECT
======================================== */

router.put("/:id", (req, res) => {

const project =
projects.find(
item => item.id == req.params.id
);

if (!project) {

return res.status(404).json({

  success: false,

  message: "Project Not Found"

});

}

project.name =
req.body.name || project.name;

project.language =
req.body.language || project.language;

project.framework =
req.body.framework || project.framework;

project.visibility =
req.body.visibility || project.visibility;

res.json({

success: true,

message: "Project updated successfully",

project

});

});

/* ========================================
FAVORITE PROJECT
======================================== */

router.post("/:id/favorite", (req, res) => {

const project =
projects.find(
item => item.id == req.params.id
);

if (!project) {

return res.status(404).json({

  success: false,

  message: "Project Not Found"

});

}

project.favorite =
!project.favorite;

res.json({

success: true,

favorite: project.favorite,

project

});

});

/* ========================================
RECENT PROJECTS
======================================== */

router.get("/recent/all", (req, res) => {

const recentProjects =
projects.slice(0, 5);

res.json({

success: true,

recentProjects

});

});

/* ========================================
PROJECT TEMPLATES
======================================== */

router.get("/templates/all", (req, res) => {

res.json({

success: true,

templates: [

  "Next.js",

  "React",

  "Vue",

  "Node.js",

  "Express",

  "Python",

  "TypeScript",

  "AI SaaS"

]

});

});

/* ========================================
DELETE PROJECT
======================================== */

router.delete("/:id", (req, res) => {

const index =
projects.findIndex(
item => item.id == req.params.id
);

if (index === -1) {

return res.status(404).json({

  success: false,

  message: "Project Not Found"

});

}

const deletedProject =
projects.splice(index, 1);

res.json({

success: true,

message: "Project deleted successfully",

deletedProject

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
