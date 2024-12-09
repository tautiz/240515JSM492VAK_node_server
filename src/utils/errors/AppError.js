class AppError extends Error {
    constructor(message, statusCode, errorType = 'APP_ERROR', details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
