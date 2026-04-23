/**
 * Request Timeout Module
 * Prevents Slowloris and long-running request attacks
 */

const timeout = require('connect-timeout');

// Timeout configuration
const TIMEOUT_MS = 30000; // 30 seconds

const timeoutHandler = timeout(TIMEOUT_MS, {
    respond: true,
    message: 'Request timeout - operation took too long'
});

// Error handler for timeouts
const timeoutErrorHandler = (req, res, next) => {
    if (req.timedout) {
        return res.status(503).json({
            status: 'error',
            code: 'REQUEST_TIMEOUT',
            message: 'Service unavailable - request timed out'
        });
    }
    next();
};

// Server timeout configuration helper
const configureServerTimeout = (server) => {
    // Set server timeout
    server.timeout = TIMEOUT_MS + 5000; // 5 seconds buffer
    
    // Set keep-alive timeout
    server.keepAliveTimeout = 65000;
    
    // Set headers timeout
    server.headersTimeout = 66000;
    
    return server;
};

module.exports = {
    timeoutHandler,
    timeoutErrorHandler,
    configureServerTimeout,
    TIMEOUT_MS
};
