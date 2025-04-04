const express = require('express');
const router = express.Router();
const Activity = require('../activity');

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

module.exports = router;
