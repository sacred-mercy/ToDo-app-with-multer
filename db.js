const mongoose = require("mongoose");
const Todo = require("./model/todo");
const fs = require("fs");

function connect() {
	mongoose.connect("mongodb://localhost:27017/testDb");
}

async function create(reqData) {
	try {
        console.log(reqData);
		const todo = await Todo.create({
			_id: reqData.taskId,
			name: reqData.taskName,
			isChecked: reqData.taskStatus,
			image: reqData.image,
		});
	} catch (err) {
		console.log(err.message);
	}
}

async function deleteTodo(id) {
	try {
		const todo = await Todo.findById(id);
		const imagePath = todo.image;
		fs.unlinkSync(`./uploads/${imagePath}`);
		await Todo.findByIdAndDelete(id);
	} catch (err) {
		console.log(err.message);
	}
}

async function getTodos() {
	try {
		const todos = await Todo.find({});
		return todos;
	} catch (err) {
		console.log(err.message);
	}
}

async function edit(id, taskName) {
	try {
		const todo = await Todo.findById(id);
        
        // check if taskName is undefined
		if (taskName === undefined) {
			todo.isChecked = !todo.isChecked;
		} else {
			todo.name = taskName;
		}
		await todo.save();
	} catch (err) {
		console.log(err.message);
	}
}

module.exports = {
	connect,
	create,
	deleteTodo,
	getTodos,
	edit,
};
