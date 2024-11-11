let ALLOWED_ORIGINS = ["http://localhost:8080"];

const corsHandler = (req, res, next) => {
    let origin = req.headers.origin;
    let theOrigin = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];

    res.header("Access-Control-Allow-Origin", theOrigin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
};

module.exports = corsHandler;