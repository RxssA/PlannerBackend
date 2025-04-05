const express = require('express');
const router = express.Router();
const Activity = require('../schemas/activity');

router.post('/create', async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const activities = await Activity.find().populate('participants');
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/messages', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity.messages || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/messages', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        if (!activity.messages) {
            activity.messages = [];
        }
        
        activity.messages.push({
            sender: req.body.sender,
            message: req.body.message,
            timestamp: new Date()
        });
        
        await activity.save();
        res.status(201).json(activity.messages[activity.messages.length - 1]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
