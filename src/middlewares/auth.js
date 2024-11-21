'use strict';
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {

    const  authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Nepavyko prisijungti 1' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Nepavyko prisijungti 2' });
    }

    const user = await User.findOne({ token });
    if (!user) {
        return res.status(401).json({ error: 'Nepavyko prisijungti 3' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Nepavyko prisijungti 4' });
        }
    });

    req.user = user;
    next();
};

module.exports = authorize;