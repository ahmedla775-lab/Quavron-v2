const express = require("express");

const router = express.Router();

/* ========================================
TEMP FILE STORAGE
======================================== */

let files = [

{
id: 1,
name: "index.html",
content: "<h1>Hello Quavron</h1>",
language: "html"
},

{
id: 2,
name: "style.css",
content: "body { background: black; }",
language: "css"
}

];

/* ========================================
GET ALL FILES
======================================== */

router.get("/", (req, res) => {

res.json({

success: true,

total: files.length,

files

});

});

/* ========================================
GET SINGLE FILE
======================================== */

router.get("/:id", (req, res) => {

const file = files.find(
file => file.id == req.params.id
);

if (!file) {

return res.status(404).json({

  success: false,

  message: "File Not Found"

});

}

res.json({

success: true,

file

});

});

/* ========================================
CREATE FILE
======================================== */

router.post("/create", (req, res) => {

const {

name,

content,

language

} = req.body;

if (!name) {

return res.status(400).json({

  success: false,

  message: "File name is required"

});

}

const newFile = {

id: Date.now(),

name,

content: content || "",

language: language || "text"

};

files.push(newFile);

res.json({

success: true,

message: "File created successfully",

file: newFile

});

});

/* ========================================
UPDATE FILE
======================================== */

router.put("/:id", (req, res) => {

const file = files.find(
file => file.id == req.params.id
);

if (!file) {

return res.status(404).json({

  success: false,

  message: "File Not Found"

});

}

file.name =
req.body.name || file.name;

file.content =
req.body.content || file.content;

file.language =
req.body.language || file.language;

res.json({

success: true,

message: "File updated successfully",

file

});

});

/* ========================================
DELETE FILE
======================================== */

router.delete("/:id", (req, res) => {

const fileIndex = files.findIndex(
file => file.id == req.params.id
);

if (fileIndex === -1) {

return res.status(404).json({

  success: false,

  message: "File Not Found"

});

}

const deletedFile =
files.splice(fileIndex, 1);

res.json({

success: true,

message: "File deleted successfully",

deletedFile

});

});

/* ========================================
EXPORT
======================================== */

module.exports = router;
