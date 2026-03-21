const rateLimit = require('express-rate-limit');
const AppError = require('./appError');

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        status: 'fail',
        message: 'Այս IP-ից մուտք գործելու չափազանց շատ փորձեր կան, խնդրում ենք կրկին փորձել մեկ ժամից։'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = { loginLimiter };
