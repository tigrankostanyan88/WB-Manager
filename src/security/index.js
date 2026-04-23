/**
 * Security Module Index
 * Exports all security modules for centralized security management
 */

const csrf = require('./csrf');
const cors = require('./cors');
const helmet = require('./helmet');
const timeout = require('./timeout');
const sanitize = require('./sanitize');
const trustProxy = require('./trustProxy');

module.exports = {
    // CSRF Protection
    csrfProtection: csrf.csrfProtection,
    csrfErrorHandler: csrf.csrfErrorHandler,
    generateCsrfToken: csrf.generateCsrfToken,
    
    // CORS
    cors: cors.cors,
    corsErrorHandler: cors.corsErrorHandler,
    corsOptions: cors.corsOptions,
    
    helmet,
    
    // Timeout
    timeoutHandler: timeout.timeoutHandler,
    timeoutErrorHandler: timeout.timeoutErrorHandler,
    configureServerTimeout: timeout.configureServerTimeout,
    TIMEOUT_MS: timeout.TIMEOUT_MS,
    
    // Sanitization
    mongoSanitize: sanitize.mongoSanitize,
    xss: sanitize.xss,
    hpp: sanitize.hpp,
    sanitizeBody: sanitize.sanitizeBody,
    preventPrototypePollution: sanitize.preventPrototypePollution,
    
    // Trust Proxy
    trustProxy: trustProxy.trustProxy,
    getClientIP: trustProxy.getClientIP,
    isPrivateIP: trustProxy.isPrivateIP
};
