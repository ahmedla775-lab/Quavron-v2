const express = require("express");

const router = express.Router();

/* ========================================
TEMP GITHUB DATA
======================================== */

let repositories = [

{
id: 1,
name: "quavron-platform",
visibility: "public",
branch: "main",
commits: 24,
synced: true
},

{
id: 2,
name: "portfolio-website",
visibility: "private",
branch: "dev",
commits: 12,
synced: false
}

];

/* ========================================
GET ALL REPOSITORIES
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: repositories.length,

repositories

});

});

/* ========================================
GET SINGLE REPOSITORY
======================================== */

router.get("/:id", (req, res) => {

const repository =
repositories.find(
repo => repo.id == req.params.id
);

if (!repository) {

return res.status(404).json({

  success: false,

  message: "Repository Not Found"

});

}

res.json({

success: true,

repository

});

});

/* ========================================
CREATE REPOSITORY
======================================== */

router.post("/create", (req, res) => {

const {

name,

visibility

} = req.body;

if (!name) {

return res.status(400).json({

  success: false,

  message: "Repository name required"

});

}

const newRepository = {

id: Date.now(),

name,

visibility: visibility || "public",

branch: "main",

commits: 0,

synced: false

};

repositories.unshift(newRepository);

res.json({

success: true,

message: "Repository created successfully",

repository: newRepository

});

});

/* ========================================
PUSH TO GITHUB
======================================== */

router.post("/:id/push", (req, res) => {

const repository =
repositories.find(
repo => repo.id == req.params.id
);

if (!repository) {

return res.status(404).json({

  success: false,

  message: "Repository Not Found"

});

}

repository.commits += 1;

repository.synced = true;

res.json({

success: true,

message: "Changes pushed successfully 🚀",

repository

});

});

/* ========================================
PULL FROM GITHUB
======================================== */

router.post("/:id/pull", (req, res) => {

const repository =
repositories.find(
repo => repo.id == req.params.id
);

if (!repository) {

return res.status(404).json({

  success: false,

  message: "Repository Not Found"

});

}

res.json({

success: true,

message: "Repository updated successfully 🔄",

repository

});

});

/* ========================================
CREATE BRANCH
======================================== */

router.post("/:id/branch", (req, res) => {

const repository =
repositories.find(
repo => repo.id == req.params.id
);

if (!repository) {

return res.status(404).json({

  success: false,

  message: "Repository Not Found"

});

}

const branchName =
req.body.branch || "new-branch";

repository.branch = branchName;

res.json({

success: true,

message: "Branch created successfully",

branch: branchName

});

});

/* ========================================
DELETE REPOSITORY
======================================== */

router.delete("/:id", (req, res) => {

const index =
repositories.findIndex(
repo => repo.id == req.params.id
);

if (index === -1) {

return res.status(404).json({

  success: false,

  message: "Repository Not Found"

});

}

const deletedRepository =
repositories.splice(index, 1);

res.json({

success: true,

message: "Repository deleted successfully",

deletedRepository

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
