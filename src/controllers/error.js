// Global error handling middleware - separates operational from programming errors
// Operational: user-friendly message | Programming: log and send generic response
const AppError = require('../utils/appError');

// Helper for SEO metadata
const buildSEO = (req, options = {}) => {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return {
        title: options.title || 'WB-Manager',
        description: options.description || '',
        canonical: url,
        og_url: url,
        og_type: 'website',
        og_title: options.title || 'WB-Manager',
        og_description: options.description || '',
        og_image: options.og_image || '/images/default.jpg'
    };
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleSequelizeUniqueConstraintError = err => {
    const field = err.errors?.[0]?.path || 'field';
    const message = `Duplicate value for ${field}. Please use another value.`;
    return new AppError(message, 409, 'DUPLICATE_VALUE');
};

const handleSequelizeValidationError = err => {
    const messages = err.errors.map(e => e.message);
    return new AppError(`Validation error: ${messages.join(', ')}`, 400, 'VALIDATION_ERROR');
};

const handleJWTError = err => new AppError('Invalid token. Please log in.', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            code: err.code || 'INTERNAL_ERROR',
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // B) RENDERED WEBSITE
    else {
        res.status(err.statusCode).render('error', {
            ...buildSEO(req, {
                title: 'Something went wrong!',
                description: 'An error occurred.'
            }),
            msg: err.message,
            nav_active: 'error',
        });
    }
}

// This function sends error responses to the client during production. It checks if the request is coming from an API or a rendered website and responds accordingly with the appropriate status code and message.
const sendErrorProd = (err, req, res, next) => {
    // Ensure statusCode is always valid (default to 500)
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    
    // A) API requests
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                code: err.code || 'ERROR',
                message: err.message
            });
        }

        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong!'
        });
    }

    // B) Rendered website
    if (err.isOperational) {
        return res.status(statusCode).render('error', {
            ...buildSEO(req, {
                title: 'Սխալ տեղի ունեցավ',
                description: 'Խնդրում ենք փորձել կրկին ավելի ուշ։'
            }),
            msg: err.message,
            nav_active: 'error',
            user: res.locals.user || null
        });
    }
    
    // Programming/unknown error: log and send generic message
    console.error('ERROR 💥', err);
    return res.status(statusCode).render('error', {
        ...buildSEO(req, {
            title: 'Սխալ տեղի ունեցավ',
            description: 'Խնդրում ենք փորձել կրկին ավելի ուշ։'
        }),
        msg: 'Խնդրում ենք փորձել կրկին ավելի ուշ։',
        nav_active: 'error',
        user: res.locals.user || null
    });
};


// Main error handler middleware - centralizes all error processing
module.exports = (err, req, res, next) => {
    // Set safe defaults
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    
    err.statusCode = statusCode;
    err.status = status;

    // Check if running in development environment
    if (process.env.NODE_ENV === 'development') {
        // If so, send detailed error message with stack trace
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // If not, create a copy of the error object 
        let error = {...err};
        error.message = err.message;

        // Check for CastError - invalid ID format
        if (error.name === 'CastError') error = handleCastErrorDB(error);

        // Check for duplicate key errors (code 11000)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        // Sequelize Unique Constraint Error
        if (error.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(error);

        // Sequelize Validation Error
        if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error);

        // Check for validation errors with Sequelize models
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        // Check for JWT errors
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError(error);

        // Check for expired JWT tokens
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError(error);

        // Send error response to client.
        sendErrorProd(error, req, res);
    }
}
