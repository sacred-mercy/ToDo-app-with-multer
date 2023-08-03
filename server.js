const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());

app.post("/saveTodo",upload.single("image"), (req, res) => {
	let reqData = JSON.parse(req.body.jsonData);
	reqData.image = req.file.filename;
	fs.readFile("data.json", (err, data) => {
		if (err) {
			console.log(err);
		} else {
			let jsonData = JSON.parse(data);
			console.log(reqData);
			jsonData.push(reqData);
			fs.writeFile("data.json", JSON.stringify(jsonData), (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Data saved successfully"); 
				}
				res.send(req.file.filename);
			});
		}
	});
});

app.post("/editTodo", (req, res) => {
	fs.readFile("data.json", (err, data) => {		
		if (err) {
			console.log(err);
		} else {
			let jsonData = JSON.parse(data);
			let id = parseInt(req.body.id);
			let taskName = req.body.taskName;
			
			for (let i = 0; i < jsonData.length; i++) {
				if (parseInt(jsonData[i].taskId) === id) {
					jsonData[i].taskName = taskName;
					break;
				}
			}
			fs.writeFile("data.json", JSON.stringify(jsonData), (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Data saved successfully");
				}
				res.end();
			});
		}
	});
});

app.post("/checkBoxTodo", (req, res) => {
	fs.readFile("data.json", (err, data) => {
		if (err) {
			console.log(err);
		} else {
			let jsonData = JSON.parse(data);
			let id = parseInt(req.body.id);
			console.log(id);

			for (let i = 0; i < jsonData.length; i++) {
				if (parseInt(jsonData[i].taskId) === id) {
					jsonData[i].taskStatus = (jsonData[i].taskStatus) ? false : true;
					break;
				}
			}
			fs.writeFile("data.json", JSON.stringify(jsonData), (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Data saved successfully");
				}
				res.end();
			});
		}
	});
});

app.get("/getTodos", (req, res) => {
	fs.readFile("data.json", (err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.send(data);
		}
	});
});

app.delete("/deleteTodo", (req, res) => {
	fs.readFile("data.json", (err, data) => {
		if (err) {
			console.log(err);
		} else {
			let jsonData = JSON.parse(data);
			let id = req.body.id;
			for (let i = 0; i < jsonData.length; i++) {
				if (parseInt(jsonData[i].taskId) === parseInt(id)) {
					let imagePath = jsonData[i].image;
					fs.unlink(`uploads/${imagePath}`, (err) => {
						if (err) {
							console.log(err);
						} else {
							console.log("Image deleted successfully");
						}
					});
					jsonData.splice(i, 1);
                    console.log("deleted");
                    break;
				}
			}
			fs.writeFile("data.json", JSON.stringify(jsonData), (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Data deleted successfully");
				}
				res.end();
			});
		}
	});
});

app.listen(port, () => {
	console.log(`Todo app listening at http://localhost:${port}`);
});
