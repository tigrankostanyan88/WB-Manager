/**
 * CSRF Protection Module (Modern Implementation)
 * Prevents Cross-Site Request Forgery attacks using double-submit cookie pattern
 * No deprecated dependencies - uses native crypto
 */

const crypto = require('crypto');
const AppError = require('../utils/appError');

const CSRF_COOKIE_NAME = '_csrf';
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Generate cryptographically secure random token
 */
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Get CSRF token from request (header, body, or query)
 */
function getTokenFromRequest(req) {
    return req.headers[CSRF_TOKEN_HEADER] || 
        req.body?._csrf || 
        req.query?._csrf;
}

/**
 * Main CSRF protection middleware
 * Double-submit cookie pattern: same random value in cookie AND request
 */
function csrfProtection(req, res, next) {
    // Skip CSRF for safe methods
    if (CSRF_SAFE_METHODS.includes(req.method)) {
        return next();
    }
    
    // Get tokens - check cookie and form body/header
    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
    const requestToken = req.body?._csrf || 
        req.headers['x-csrf-token'] || 
        req.query?._csrf;
    // Validate both tokens exist
    if (!cookieToken) {
        return next(new AppError('CSRF cookie missing. Please refresh the page.', 403, 'CSRF_COOKIE_MISSING'));
    }
    if (!requestToken) {
        return next(new AppError('CSRF token missing in form. Please refresh the page.', 403, 'CSRF_FORM_MISSING'));
    }
    
    // Timing-safe comparison
    try {
        const match = crypto.timingSafeEqual(
            Buffer.from(cookieToken, 'hex'),
            Buffer.from(requestToken, 'hex')
        );
        
        if (!match) {
            return next(new AppError('Invalid CSRF token. Please refresh the page.', 403, 'CSRF_INVALID'));
        }
    } catch (e) {
        return next(new AppError('CSRF token error. Please refresh the page.', 403, 'CSRF_ERROR'));
    }
    
    next();
}

/**
 * Generate and set CSRF token cookie
 * Also make available for views
 */
function generateCsrfToken(req, res, next) {
    // Skip if already has valid token in cookie
    if (req.cookies?.[CSRF_COOKIE_NAME]) {
        res.locals.csrfToken = req.cookies[CSRF_COOKIE_NAME];
        return next();
    }
    
    // Generate new token
    const token = generateToken();
    
    // Set cookie (accessible to JavaScript for double-submit)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: false, // Must be accessible to JS for double-submit
        secure: isProduction, // Only secure in production
        sameSite: isProduction ? 'strict' : 'lax', // lax for dev, strict for prod
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };
    
    res.cookie(CSRF_COOKIE_NAME, token, cookieOptions);
    res.locals.csrfToken = token;
    next();
}

/**
 * Handle CSRF-specific errors
 */
function csrfErrorHandler(err, req, res, next) {
    if (!err.code?.startsWith('CSRF')) return next(err);
    
    // Generate new token for the user to retry
    const newToken = generateToken();
    res.cookie(CSRF_COOKIE_NAME, newToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });
    
    res.status(403).json({
        status: 'error',
        code: err.code,
        message: err.message,
        csrfToken: newToken
    });
}

module.exports = {
    csrfProtection,
    csrfErrorHandler,
    generateCsrfToken,
    generateToken
};
