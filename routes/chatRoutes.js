const express = require('express');
const router = express.Router();
const Activity = require('../schemas/activity');

// Get messages for a specific activity
router.get('/:activityId/messages', async (req, res) => {
    try {
        console.log(`Fetching messages for activity: ${req.params.activityId}`);
        const activity = await Activity.findById(req.params.activityId);
        if (!activity) {
            console.log(`Activity not found: ${req.params.activityId}`);
            return res.status(404).json({ error: 'Activity not found' });
        }
        console.log(`Returning ${activity.messages?.length || 0} messages for activity ${req.params.activityId}`);
        res.json(activity.messages || []);
    } catch (error) {
        console.error(`Error fetching messages for activity ${req.params.activityId}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Send a message to a specific activity
router.post('/:activityId/messages', async (req, res) => {
    try {
        console.log(`Posting message to activity: ${req.params.activityId}`);
        const activity = await Activity.findById(req.params.activityId);
        if (!activity) {
            console.log(`Activity not found: ${req.params.activityId}`);
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        if (!activity.messages) {
            activity.messages = [];
        }
        
        const hasImage = !!req.body.image;
        const imageSize = req.body.image ? req.body.image.length : 0;
        console.log(`Message contains image: ${hasImage}, image data size: ${imageSize / 1024} KB`);
        
        // Check if image is too large (>5MB)
        if (hasImage && imageSize > 5 * 1024 * 1024) {
            console.warn(`Image too large (${imageSize / 1024 / 1024} MB), rejecting message`);
            return res.status(413).json({ error: 'Image too large, please reduce its size (max 5MB)' });
        }
        
        const newMessage = {
            sender: req.body.sender,
            text: req.body.text,
            image: req.body.image, // Store base64 string directly
            timestamp: new Date(),
            id: Date.now().toString() // Make sure we have a unique ID
        };
        
        activity.messages.push(newMessage);
        await activity.save();
        console.log(`Message saved to activity ${req.params.activityId}, total messages: ${activity.messages.length}`);
        
        // Only emit from the server, not from the client
        if (req.app.get('io')) {
            console.log('Emitting message through socket.io');
            req.app.get('io').emit('receiveMessage', {
                ...newMessage,
                activityId: req.params.activityId
            });
        } else {
            console.log('Socket.io not available for this request');
        }
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(`Error saving message to activity ${req.params.activityId}:`, error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 