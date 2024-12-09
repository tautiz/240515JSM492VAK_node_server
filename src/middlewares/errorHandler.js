const ErrorTypes = require('../utils/errors/errorTypes');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Spausdina klaidą konsolėje (naudokite logavimo įrankius gamybos aplinkoje)
    if (process.env.NODE_DEBUG === 'true') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
    }

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            fields: err.details,
            message: err.message,
            stack: err.stack
        });
    }

    if (err.errorType === ErrorTypes.VALIDATION_ERROR) {
        return res.status(err.statusCode).json({
            message: err.message,
            fields: err.details
        });
    }

    // Atsakas gamybos aplinkoje
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Nežinomos klaidos
    return res.status(500).json({
        status: 'error',
        message: 'Kažkas nutiko netinkamai'
    });
};

// Valdo neapdorotus Promise romiir išimčių atvejus
process.on('unhandledRejection', (err) => {
    console.error('NEAPDOROTAS PROMISE 💥 Sistema bus išjungta...');
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('NEAPDOROTA IŠIMTIS! 💥 Sistema bus išjungta...');
    console.error(err.name, err.message);
    process.exit(1);
});

module.exports = errorHandler;
