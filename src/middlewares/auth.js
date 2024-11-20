'use strict';
const User = require('../models/user');
const bcrypt = require('bcrypt');

const authorize = async (req, res, next) => {
    const { email, password } = req.headers;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Neteisingi prisijungimo duomenys' });
    }
    req.user = user;
    next();
};
module.exports = authorize;