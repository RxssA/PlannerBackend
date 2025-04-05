const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }
});

module.exports = mongoose.model("Todo", TodoSchema); 