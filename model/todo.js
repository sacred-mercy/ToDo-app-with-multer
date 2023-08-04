const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: String,
    isChecked: Boolean,
    image: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true, 
    },  
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;