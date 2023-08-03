let firstPill = document.getElementById("taskPill");
let taskid = 0;

function initialization() {
	// remove the display none property from pill for future children
	firstPill.classList.remove("d-none");

	// remove that pill from html
	firstPill.remove();

	getTasks();
}

function getTasks() {
	let viewArea = document.getElementById("viewArea");
	viewArea.innerHTML = "";
	// get request to get all the tasks
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/getTodos", true);
	xhr.send();

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			let data = JSON.parse(xhr.responseText);
			if (data.length === 0 || data === null || data === undefined) {
				taskid = 0;
				document.getElementById("viewArea").innerHTML = "<h1>Nothing to show</h1>";
				return;
			} else {
				taskid = data[data.length - 1].taskId + 1;
			}
			for (let i = 0; i < data.length; i++) {
				addPillToParent(data[i].taskId, data[i].taskName,data[i].image, data[i].taskStatus);
			}
		}
	};
}

function checkBoxClick(checkBox) {
	let pill = checkBox.closest(".pill");
	let idNum = pill.id;
	let pillChildren = pill.children;
	let textOfPill = pillChildren["0"];
	let editButton = pillChildren["2"];

	let isChecked = checkBox.classList.contains("btn-dark");

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/checkBoxTodo", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({ id: idNum }));
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				if (!isChecked) {
					textOfPill.classList.add("text-decoration-line-through");
					textOfPill.classList.add("text-muted");
					checkBox.classList.add("btn-dark");
					editButton.classList.add("invisible");
				} else {
					textOfPill.classList.remove("text-decoration-line-through");
					textOfPill.classList.remove("text-muted");
					checkBox.classList.remove("btn-dark");
					editButton.classList.remove("invisible");
				}
			} else {
				console.log("failure");
			}
		}
	};
}

function addPillToParent(num, data, imagePath, checked = false) {
	// creating new pill from firstPill
	let newPill = firstPill.cloneNode(true);
	newPill.id = num;

	// adding pill to viewArea and inserting text inside it
	let parentOfPill = document.getElementById("viewArea");
	parentOfPill.appendChild(newPill);
	newPill.querySelector(".taskText").innerText = data;
	newPill.querySelector("#taskImg").src = imagePath;

	if (checked) {
		let pillChildren = newPill.children;
		let textOfPill = pillChildren["0"];
		let editButton = pillChildren["1"];
		let checkBox = pillChildren["2"];
		textOfPill.classList.add("text-decoration-line-through");
		textOfPill.classList.add("text-muted");
		checkBox.classList.add("btn-dark");
		editButton.classList.add("invisible");
	}
}

function addToDo() {
	let taskData = document.getElementById("taskTextarea").value.trim();
	const image = document.querySelector("#imgFile").files[0];

	if (taskData === "") {
		window.alert("Please enter a text in task");
		return;
	}
	document.getElementById("taskTextarea").value = "";

	if(taskid === 0){
		document.getElementById("viewArea").innerHTML = "";
	}

	if (image === undefined) {
		window.alert("Please select an image");
		return;
	}

	const jsonData = {
		taskId: taskid,
		taskName: taskData,
		taskStatus: false,
	};
	const formData = new FormData();
	formData.append("image", image);
	formData.append("jsonData", JSON.stringify(jsonData));
	console.log(formData);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/saveTodo", true);
	// xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(formData);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let imagePath = xhr.responseText;
				console.log("Data sent successfully");
				// create new pill from firstPill
				let lastPill = firstPill.cloneNode(true);
				// add new pill to viewArea
				addPillToParent(taskid, taskData, imagePath);
				taskid++;
			} else {
				console.log("Error in sending data");
			}
		}
	};
}

function editTask(editButton) {
	let pill = editButton.closest(".pill");
	let idNum = pill.id;
	let textOfPill = pill.querySelector(".taskText").innerText.trim();
	let text = prompt("Enter the edit", textOfPill).trim();
	if (text === "" || text === null || text === undefined || text === textOfPill) {
		return;
	}
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/editTodo", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(
		JSON.stringify({
			id: idNum,
			taskName: text,
		})
	);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log("Data sent to edit successfully");
				pill.querySelector(".taskText").innerText = text;
			} else {
				console.log("Error in sending data");
			}
		}
	};
}

function deleteTask(deleteButton) {
	let pill = deleteButton.closest(".pill");
	let idNum = pill.id;

	let xhr = new XMLHttpRequest();
	xhr.open("DELETE", "/deleteTodo", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({ id: idNum }));

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log("Data sent to delete successfully");
				pill.remove();
			} else {
				console.log("Error in deleting data");
			}
		}
	};
}

function textAreaOnButtonPress() {
	let textArea = document.getElementById("taskTextarea");
	textArea.addEventListener("keydown", function (event) {
		if (event.code !== "ShiftLeft" && event.code !== "ShiftRight") {
			if (event.code === "Enter") {
				event.preventDefault();
				document.getElementById("AddTaskBtn").click();
			}
		}
	});
}

initialization();
textAreaOnButtonPress();
