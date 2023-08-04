const express = require("express");
const fs = require("fs");
const multer = require("multer");
const db = require("./db");

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());

app.post("/saveTodo", upload.single("image"), (req, res) => {
	let reqData = JSON.parse(req.body.jsonData);
	reqData.image = req.file.filename;

	db.connect();
	db.create(reqData);

	res.send(req.file.filename);
});

app.post("/editTodo", (req, res) => {
	let id = parseInt(req.body.id);
	let taskName = req.body.taskName;

	db.connect();
	db.edit(id, taskName);

	res.end();
});

app.post("/checkBoxTodo", (req, res) => {
	let id = parseInt(req.body.id);

	db.connect();
	db.edit(id);

	res.end();
});

app.get("/getTodos", async (req, res) => {
	db.connect();
	const todos = await db.getTodos();
	res.send(todos);
});

app.delete("/deleteTodo", (req, res) => {
	let id = req.body.id;
	db.connect();
	db.deleteTodo(id);

	res.end();
});

app.listen(port, () => {
	console.log(`Todo app listening at http://localhost:${port}`);
});
