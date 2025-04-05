const express = require('express');
const router = express.Router();
const Notification = require('../schemas/notification');

// Get all notifications
router.get('/list', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a notification
router.put('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 