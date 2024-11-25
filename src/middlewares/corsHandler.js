// Tarpdomeninio išteklių bendrinimo (CORS) tvarkymo tarpinė programinė įranga
// Šis modulis tvarko CORS užklausas, leidžia tik tas, kurios ateina iš leidžiamų domenų.
// Jis nustato atitinkamas CORS antraštes ir tvarko išankstines OPTIONS užklausas.

const ALLOWED_DOMAINS = [
    "localhost",
    "127.0.0.1",
    "example.com",
    "api.example.com"
];

/**
 * Tarpinė programinė įranga (middleware) skirta tvarkyti Tarpdomeninius išteklių 
 * bendrinimo (CORS) užklausas.
 * 
 * Ši funkcija tikrina įeinančios užklausos 'Origin' antraštę, kad nustatytų, ar 
 * užklausos kilmės domenas yra tarp leidžiamų domenų. Jei domenas yra leidžiamas, 
 * nustatomos atitinkamos CORS antraštės, kurios leidžia užklausą. Taip pat tvarkomi 
 * išankstiniai OPTIONS užklausų tipai, į kuriuos atsakoma su 200 būsenos kodu.
 * 
 * @param {Object} req - HTTP užklausos objektas, kuriame saugoma visa užklausos informacija
 * @param {Object} res - HTTP atsakymo objektas, naudojamas siųsti atsakymą
 * @param {Function} next - Funkcija, perduodanti valdymą kitai tarpinei programinei įrangai
 */
const corsHandler = (req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin) {
        try {
            const url = new URL(origin);
            const hostname = url.hostname;
            
            if (ALLOWED_DOMAINS.includes(hostname)) {
                res.header("Access-Control-Allow-Origin", origin);
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                res.header("Access-Control-Allow-Credentials", "true");
            }
        } catch (error) {
            console.error("Netinkamas kilmės adresas:", origin);
        }
    }

    // Tvarkyti išankstines užklausas
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }

    next();
};

module.exports = corsHandler;