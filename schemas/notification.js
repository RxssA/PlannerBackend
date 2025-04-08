const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    scheduledTime: Date,
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
});

module.exports = mongoose.model("Notification", NotificationSchema); 