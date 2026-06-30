const express = require("express");

const router = express.Router();

/* ========================================
TEMP DATABASE CONNECTIONS
======================================== */

let databases = [

{
id: 1,
name: "MongoDB Production",
type: "mongodb",
status: "connected",
host: "cluster.mongodb.net",
createdAt: new Date()
},

{
id: 2,
name: "PostgreSQL Dev",
type: "postgresql",
status: "disconnected",
host: "localhost",
createdAt: new Date()
}

];

/* ========================================
GET ALL DATABASES
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: databases.length,

databases

});

});

/* ========================================
GET SINGLE DATABASE
======================================== */

router.get("/:id", (req, res) => {

const database =
databases.find(
db => db.id == req.params.id
);

if (!database) {

return res.status(404).json({

  success: false,

  message: "Database Not Found"

});

}

res.json({

success: true,

database

});

});

/* ========================================
CREATE DATABASE CONNECTION
======================================== */

router.post("/connect", (req, res) => {

const {

name,

type,

host

} = req.body;

if (
!name ||
!type
) {

return res.status(400).json({

  success: false,

  message: "Name and database type required"

});

}

const newDatabase = {

id: Date.now(),

name,

type,

host: host || "localhost",

status: "connected",

createdAt: new Date()

};

databases.unshift(newDatabase);

res.json({

success: true,

message: "Database connected successfully",

database: newDatabase

});

});

/* ========================================
RUN QUERY
======================================== */

router.post("/:id/query", (req, res) => {

const database =
databases.find(
db => db.id == req.params.id
);

if (!database) {

return res.status(404).json({

  success: false,

  message: "Database Not Found"

});

}

const {

query

} = req.body;

if (!query) {

return res.status(400).json({

  success: false,

  message: "Query required"

});

}

res.json({

success: true,

message: "Query executed successfully",

result: {

  rows: 12,

  executionTime: "14ms",

  query

}

});

});

/* ========================================
DATABASE STATUS
======================================== */

router.get("/:id/status", (req, res) => {

const database =
databases.find(
db => db.id == req.params.id
);

if (!database) {

return res.status(404).json({

  success: false,

  message: "Database Not Found"

});

}

res.json({

success: true,

status: {

  database: database.name,

  connection: database.status,

  uptime: "99.9%",

  latency: "12ms"

}

});

});

/* ========================================
DISCONNECT DATABASE
======================================== */

router.put("/:id/disconnect", (req, res) => {

const database =
databases.find(
db => db.id == req.params.id
);

if (!database) {

return res.status(404).json({

  success: false,

  message: "Database Not Found"

});

}

database.status = "disconnected";

res.json({

success: true,

message: "Database disconnected",

database

});

});

/* ========================================
DELETE DATABASE
======================================== */

router.delete("/:id", (req, res) => {

const index =
databases.findIndex(
db => db.id == req.params.id
);

if (index === -1) {

return res.status(404).json({

  success: false,

  message: "Database Not Found"

});

}

const deletedDatabase =
databases.splice(index, 1);

res.json({

success: true,

message: "Database removed successfully",

deletedDatabase

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
