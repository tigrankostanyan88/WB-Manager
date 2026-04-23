/**
 * Helmet Security Module
 * Comprehensive security headers
 */

const helmet = require('helmet');

const helmetConfig = {
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://cdnjs.cloudflare.com",
                "https://maps.googleapis.com",
                "https://cdn.jsdelivr.net"
            ],
            scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "data:"
            ],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'",
                "https://maps.googleapis.com",
                "https://*.firebaseio.com",
                "wss://*.firebaseio.com"
            ],
            frameSrc: ["'self'", "https://www.google.com", "https://maps.googleapis.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    
    // DNS Prefetch Control
    dnsPrefetchControl: {
        allow: false
    },
    
    // Frameguard (Clickjacking protection)
    frameguard: {
        action: 'sameorigin'
    },
    
    // Hide Powered-By
    hidePoweredBy: true,
    
    // HTTP Strict Transport Security
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    
    // IE No Open
    ieNoOpen: true,
    
    // No Sniff
    noSniff: true,
    
    // Origin Agent Cluster
    originAgentCluster: true,
    
    // Permitted Cross-Domain Policies
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none'
    },
    
    // Referrer Policy
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },
    
    // XSS Filter
    xssFilter: true,
    
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: false, // Allow embedded resources
    
    // Cross-Origin Opener Policy
    crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups'
    },
    
    // Cross-Origin Resource Policy
    crossOriginResourcePolicy: {
        policy: 'cross-origin'
    }
};

module.exports = helmet(helmetConfig);
