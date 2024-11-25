// Autorizacijos tarpinė programinė įranga
// Šis modulis tikrina, ar užklausoje yra tinkamas autorizacijos žetonas, ir nustato vartotoją, jei žetonas galioja.
// Jei žetonas negalioja arba nėra, grąžinamas 401 klaidos kodas.

'use strict';
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {

    // Gauti autorizacijos antraštė iš užklausos
    const  authHeader = req.headers.authorization;
    if (!authHeader) {
        // Jei autorizacijos antraštės nėra, grąžinti 401 klaidos kodas
        return res.status(401).json({ error: 'Nera autorizavimo headeriu' });
    }

    // Gauti autorizacijos žetoną iš antraštės
    const token = authHeader.split(' ')[1];
    if (!token) {
        // Jei žetonas nėra, grąžinti 401 klaidos kodas
        return res.status(401).json({ error: 'Nera tokenu' });
    }

    // Rasti vartotoją pagal žetoną
    const user = await User.findOne({ token });
    if (!user) {
        // Jei vartotojas nerastas, grąžinti 401 klaidos kodas
        return res.status(401).json({ error: 'Nerastas vartotojas' });
    }

    // Patikrinti žetoną su slaptafraze
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Jei žetonas netinkamas, grąžinti 401 klaidos kodas
            return res.status(401).json({ error: 'Nepavyko prisijungti: ' + err.toString() });
        }
    });

    // Nustatyti vartotoją užklausos objekte
    req.user = user;
    next();
};

module.exports = authorize;