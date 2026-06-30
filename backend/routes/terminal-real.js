const express = require("express");

const router = express.Router();

/* ========================================
TEMP TERMINAL HISTORY
======================================== */

let terminalHistory = [

{
id: 1,
command: "npm install",
output: "Packages installed successfully",
status: "success",
createdAt: new Date()
},

{
id: 2,
command: "npm run dev",
output: "Development server started",
status: "running",
createdAt: new Date()
}

];

/* ========================================
GET TERMINAL HISTORY
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: terminalHistory.length,

terminalHistory

});

});

/* ========================================
EXECUTE COMMAND
======================================== */

router.post("/execute", (req, res) => {

const { command } = req.body;

if (!command) {

return res.status(400).json({

  success: false,

  message: "Command is required"

});

}

let output = "Command executed";

let status = "success";

/* SIMULATED COMMANDS */

if (command.includes("npm install")) {

output =
  "Installing dependencies...\nDone successfully ✅";

}

else if (command.includes("npm run dev")) {

output =
  "Development server started on port 3000 🚀";

status = "running";

}

else if (command.includes("git status")) {

output =
  "On branch main\nNothing to commit";

}

else if (command.includes("clear")) {

output = "Terminal cleared";

}

else {

output =
  `Executed: ${command}`;

}

const terminalEntry = {

id: Date.now(),

command,

output,

status,

createdAt: new Date()

};

terminalHistory.unshift(terminalEntry);

res.json({

success: true,

terminal: terminalEntry

});

});

/* ========================================
GET SINGLE COMMAND
======================================== */

router.get("/:id", (req, res) => {

const command =
terminalHistory.find(
item => item.id == req.params.id
);

if (!command) {

return res.status(404).json({

  success: false,

  message: "Command Not Found"

});

}

res.json({

success: true,

command

});

});

/* ========================================
DELETE TERMINAL ENTRY
======================================== */

router.delete("/:id", (req, res) => {

const index =
terminalHistory.findIndex(
item => item.id == req.params.id
);

if (index === -1) {

return res.status(404).json({

  success: false,

  message: "Entry Not Found"

});

}

const deletedEntry =
terminalHistory.splice(index, 1);

res.json({

success: true,

message: "Terminal entry deleted",

deletedEntry

});

});

/* ========================================
CLEAR TERMINAL
======================================== */

router.delete("/", (req, res) => {

terminalHistory = [];

res.json({

success: true,

message: "Terminal history cleared"

});

});

/* ========================================
TERMINAL STATUS
======================================== */

router.get("/status/runtime", (req, res) => {

res.json({

success: true,

runtime: {

  status: "online",

  cpu: "12%",

  memory: "420MB",

  uptime: "2h 14m"

}

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
