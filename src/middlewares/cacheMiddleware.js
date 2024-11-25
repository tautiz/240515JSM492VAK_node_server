// Kešavimo tarpinė programinė įranga
// Šis modulis naudoja NodeCache biblioteką, kad kešuotų HTTP atsakymus.
// Jei užklausa jau yra keše, grąžinamas kešuotas atsakymas, kitaip atsakymas įrašomas į kešą.

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

exports.cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedData = cache.get(key);

    if (cachedData) {
        return res.json(cachedData);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };
    
    next();
};
