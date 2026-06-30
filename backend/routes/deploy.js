const express = require("express");

const router = express.Router();

/* ========================================
TEMP DEPLOYMENTS STORAGE
======================================== */

let deployments = [

{
id: 1,
project: "Quavron IDE",
platform: "Vercel",
status: "success",
url: "https://quavron.vercel.app",
createdAt: new Date()
},

{
id: 2,
project: "Portfolio Website",
platform: "Netlify",
status: "building",
url: "https://portfolio.netlify.app",
createdAt: new Date()
}

];

/* ========================================
GET ALL DEPLOYMENTS
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: deployments.length,

deployments

});

});

/* ========================================
GET SINGLE DEPLOYMENT
======================================== */

router.get("/:id", (req, res) => {

const deployment =
deployments.find(
item => item.id == req.params.id
);

if (!deployment) {

return res.status(404).json({

  success: false,

  message: "Deployment Not Found"

});

}

res.json({

success: true,

deployment

});

});

/* ========================================
CREATE DEPLOYMENT
======================================== */

router.post("/create", (req, res) => {

const {

project,

platform

} = req.body;

if (
!project ||
!platform
) {

return res.status(400).json({

  success: false,

  message: "Project and platform required"

});

}

const newDeployment = {

id: Date.now(),

project,

platform,

status: "building",

url: `https://${project
  .toLowerCase()
  .replace(/\s+/g, "-")}.app`,

createdAt: new Date()

};

deployments.unshift(newDeployment);

/* SIMULATE BUILD PROCESS */

setTimeout(() => {

newDeployment.status = "success";

}, 5000);

res.json({

success: true,

message: "Deployment started successfully",

deployment: newDeployment

});

});

/* ========================================
UPDATE DEPLOYMENT STATUS
======================================== */

router.put("/:id/status", (req, res) => {

const deployment =
deployments.find(
item => item.id == req.params.id
);

if (!deployment) {

return res.status(404).json({

  success: false,

  message: "Deployment Not Found"

});

}

deployment.status =
req.body.status || deployment.status;

res.json({

success: true,

message: "Deployment status updated",

deployment

});

});

/* ========================================
DELETE DEPLOYMENT
======================================== */

router.delete("/:id", (req, res) => {

const index =
deployments.findIndex(
item => item.id == req.params.id
);

if (index === -1) {

return res.status(404).json({

  success: false,

  message: "Deployment Not Found"

});

}

const deletedDeployment =
deployments.splice(index, 1);

res.json({

success: true,

message: "Deployment deleted successfully",

deletedDeployment

});

});

/* ========================================
DEPLOYMENT LOGS
======================================== */

router.get("/:id/logs", (req, res) => {

res.json({

success: true,

logs: [

  "Installing dependencies...",

  "Building project...",

  "Optimizing assets...",

  "Deployment completed successfully 🚀"

]

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
