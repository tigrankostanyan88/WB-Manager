const cors = require('cors');

// Allowed origins
const allowedOrigins = [
    'http://localhost:3300',
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        if (process.env.NODE_ENV === 'production') {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['X-CSRF-Token'],
    maxAge: 86400 // 24 hours
};

// CORS error handler
const corsErrorHandler = (err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            status: 'error',
            code: 'CORS_ERROR',
            message: 'Origin not allowed'
        });
    }
    next(err);
};

module.exports = {
    cors: cors(corsOptions),
    corsErrorHandler,
    corsOptions
};
