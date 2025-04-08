const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'my_secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware; 