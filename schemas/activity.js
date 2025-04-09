const mongoose = require('mongoose');

// Create a dedicated Message schema
const MessageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    image: String, // Base64 image data
    timestamp: { type: Date, default: Date.now },
    id: String
});

// Update Activity schema to use the Message schema
const ActivitySchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    messages: [MessageSchema]
    /*location: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: String }],*/
});

module.exports = mongoose.model("Activity", ActivitySchema);
