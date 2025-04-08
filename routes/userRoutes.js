// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const jwt = require('jsonwebtoken');

// Create new user
router.post('/create', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        
        // Generate token
        const token = jwt.sign({ userId: user._id }, 'my_secret_key', { expiresIn: '1h' });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            user: { 
                id: user._id,
                username: user.username,
                email: user.email
            },
            token 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'User not found' });
        }

        // Check password
        console.log('Checking password...');
        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, 'my_secret_key', { expiresIn: '1h' });
        console.log('Token generated successfully');

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Login error details:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

module.exports = router;
