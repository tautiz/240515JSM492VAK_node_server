'use strict';

const jwt = require('jsonwebtoken');

class AuthRepository {
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });
    }

    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    }

    extractTokenFromHeader(authHeader) {
        if (!authHeader) return null;
        const [bearer, token] = authHeader.split(' ');
        return bearer === 'Bearer' ? token : null;
    }
}

module.exports = new AuthRepository();
