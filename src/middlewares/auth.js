// Autorizacijos tarpinė programinė įranga
// Šis modulis tikrina, ar užklausoje yra tinkamas autorizacijos žetonas, ir nustato vartotoją, jei žetonas galioja.
// Jei žetonas negalioja arba nėra, grąžinamas 401 klaidos kodas.

'use strict';

const userRepository = require('../repositories/userRepository');
const authRepository = require('../repositories/authRepository');

const authorize = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authRepository.extractTokenFromHeader(authHeader);
        
        if (!token) {
            return res.status(401).json({ error: 'Nėra autorizacijos token' });
        }

        const user = await userRepository.findByToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Nerastas vartotojas' });
        }

        await authRepository.verifyToken(token);
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Nepavyko prisijungti: ' + error.message });
    }
};

module.exports = authorize;