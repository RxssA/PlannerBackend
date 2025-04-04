const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: String }],
    messages: [{ sender: String, message: String, timestamp: Date }]
});

module.exports = mongoose.model("Activity", ActivitySchema);
