const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");

const upload = multer({dest: "uploads/"});

app.use(express.static("public"));

app.post("/uploadFile", upload.single("file"), (req, res) => {
	console.log(req.file);
    res.send("File uploaded successfully!");
});

app.get("/home", (req, res) => {
	res.render("home");
});



app.listen(3000, () => {
	console.log("server started");
});
