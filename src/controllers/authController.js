'use strict';

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Toks vartotojas jau egzistuoja" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: "Klaida išsaugant duomenis: " + err.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }

        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Neteisingi prisijungimo duomenys' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1minutes' });
        user.token = token;
        await user.save();
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Klaida jungiantis i sistema "});
    }
};