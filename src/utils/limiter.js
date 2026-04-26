const rateLimit = require('express-rate-limit');
const AppError = require('./appError');

// Strict limiter for authentication endpoints
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: {
        status: 'fail',
        message: 'Այս IP-ից մուտք գործելու չափազանց շատ փորձեր կան, խնդրում ենք կրկին փորձել մեկ ժամից։'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    },
    standardHeaders: true, 
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
});

// API general limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        status: 'fail',
        message: 'Չափազանց շատ հարցումներ, խնդրում ենք կրկին փորձել 15 րոպեից։'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Read-heavy endpoints limiter (higher limits for GET requests)
const readLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: {
        status: 'fail',
        message: 'Չափազանց շատ ընթերցման հարցումներ։'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Write endpoints limiter (POST/PUT/DELETE)
const writeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 write requests per minute
    message: {
        status: 'fail',
        message: 'Չափազանց շատ գրանցման/թարմացման հարցումներ։'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { 
    loginLimiter, 
    apiLimiter, 
    readLimiter, 
    writeLimiter 
};
