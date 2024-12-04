'use strict';

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const authRepository = require('../repositories/authRepository');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Toks vartotojas jau egzistuoja" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({ 
            email, 
            password: hashedPassword,
            role: 'user' // numatytoji rolė naujiems vartotojams
        });

        res.status(201).json({ 
            id: user._id,
            email: user.email,
            role: user.role
        });
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

        const user = await userRepository.findByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Neteisingi prisijungimo duomenys' });
        }

        const token = authRepository.generateToken({ userId: user._id });
        await userRepository.updateToken(user._id, token);

        res.json({ 
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Klaida jungiantis į sistemą: " + err.toString() });
    }
};