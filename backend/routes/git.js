const express = require("express");

const router = express.Router();

/* ========================================
TEMP GIT STORAGE
======================================== */

let commits = [

{
id: 1,
message: "Initial Commit",
branch: "main",
author: "ALGERIEN",
createdAt: new Date()
},

{
id: 2,
message: "Added Dashboard UI",
branch: "main",
author: "ALGERIEN",
createdAt: new Date()
}

];

let branches = [

"main",

"dev"

];

/* ========================================
GET ALL COMMITS
======================================== */

router.get("/commits", (req, res) => {

res.json({

success: true,

total: commits.length,

commits

});

});

/* ========================================
CREATE COMMIT
======================================== */

router.post("/commit", (req, res) => {

const {

message,

author,

branch

} = req.body;

if (!message) {

return res.status(400).json({

  success: false,

  message: "Commit message required"

});

}

const newCommit = {

id: Date.now(),

message,

branch: branch || "main",

author: author || "Unknown",

createdAt: new Date()

};

commits.unshift(newCommit);

res.json({

success: true,

message: "Commit created successfully",

commit: newCommit

});

});

/* ========================================
GET SINGLE COMMIT
======================================== */

router.get("/commits/:id", (req, res) => {

const commit =
commits.find(
item => item.id == req.params.id
);

if (!commit) {

return res.status(404).json({

  success: false,

  message: "Commit Not Found"

});

}

res.json({

success: true,

commit

});

});

/* ========================================
GET ALL BRANCHES
======================================== */

router.get("/branches", (req, res) => {

res.json({

success: true,

total: branches.length,

branches

});

});

/* ========================================
CREATE BRANCH
======================================== */

router.post("/branch", (req, res) => {

const {

name

} = req.body;

if (!name) {

return res.status(400).json({

  success: false,

  message: "Branch name required"

});

}

if (branches.includes(name)) {

return res.status(400).json({

  success: false,

  message: "Branch already exists"

});

}

branches.push(name);

res.json({

success: true,

message: "Branch created successfully",

branch: name

});

});

/* ========================================
MERGE BRANCH
======================================== */

router.post("/merge", (req, res) => {

const {

source,

target

} = req.body;

if (
!source ||
!target
) {

return res.status(400).json({

  success: false,

  message: "Source and target branches required"

});

}

res.json({

success: true,

message:
  `${source} merged into ${target} successfully 🚀`

});

});

/* ========================================
DELETE BRANCH
======================================== */

router.delete("/branch/:name", (req, res) => {

const branchName =
req.params.name;

const branchIndex =
branches.indexOf(branchName);

if (branchIndex === -1) {

return res.status(404).json({

  success: false,

  message: "Branch Not Found"

});

}

branches.splice(branchIndex, 1);

res.json({

success: true,

message: "Branch deleted successfully"

});

});

/* ========================================
GIT STATUS
======================================== */

router.get("/status", (req, res) => {

res.json({

success: true,

status: {

  currentBranch: "main",

  modifiedFiles: 3,

  stagedFiles: 2,

  lastCommit: commits[0]

}

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
