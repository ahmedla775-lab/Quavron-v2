const express = require("express");

const router = express.Router();

/* ========================================
TEMP USERS STORAGE
======================================== */

let users = [

{
id: 1,
fullName: "ALGERIEN",
email: "admin@quavron.com",
role: "admin",
plan: "pro"
},

{
id: 2,
fullName: "Developer",
email: "developer@quavron.com",
role: "user",
plan: "free"
}

];

/* ========================================
GET ALL USERS
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: users.length,

users

});

});

/* ========================================
GET SINGLE USER
======================================== */

router.get("/:id", (req, res) => {

const user = users.find(
user => user.id == req.params.id
);

if (!user) {

return res.status(404).json({

  success: false,

  message: "User Not Found"

});

}

res.json({

success: true,

user

});

});

/* ========================================
CREATE USER
======================================== */

router.post("/create", (req, res) => {

const {

fullName,

email,

role,

plan

} = req.body;

if (
!fullName ||
!email
) {

return res.status(400).json({

  success: false,

  message: "Full name and email required"

});

}

const newUser = {

id: Date.now(),

fullName,

email,

role: role || "user",

plan: plan || "free"

};

users.push(newUser);

res.json({

success: true,

message: "User created successfully",

user: newUser

});

});

/* ========================================
UPDATE USER
======================================== */

router.put("/:id", (req, res) => {

const user = users.find(
user => user.id == req.params.id
);

if (!user) {

return res.status(404).json({

  success: false,

  message: "User Not Found"

});

}

user.fullName =
req.body.fullName || user.fullName;

user.email =
req.body.email || user.email;

user.role =
req.body.role || user.role;

user.plan =
req.body.plan || user.plan;

res.json({

success: true,

message: "User updated successfully",

user

});

});

/* ========================================
DELETE USER
======================================== */

router.delete("/:id", (req, res) => {

const userIndex = users.findIndex(
user => user.id == req.params.id
);

if (userIndex === -1) {

return res.status(404).json({

  success: false,

  message: "User Not Found"

});

}

const deletedUser =
users.splice(userIndex, 1);

res.json({

success: true,

message: "User deleted successfully",

deletedUser

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
