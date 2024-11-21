const ALLOWED_DOMAINS = [
    "localhost",
    "127.0.0.1",
    "example.com",
    "api.example.com"
];

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
            console.error("Invalid origin:", origin);
        }
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
};

module.exports = corsHandler;