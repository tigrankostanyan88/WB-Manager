const cache = require('../utils/cache');
const crypto = require('crypto');

// Generate cache key from request
// Format: api:{method}:{path}:{query}:{body_hash}
function generateCacheKey(req) {
    const method = req.method.toLowerCase();
    const path = req.originalUrl || req.url;
    const bodyHash = req.body && Object.keys(req.body).length > 0
        ? crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex').slice(0, 8)
        : '';
    
    return `api:${method}:${path}${bodyHash ? ':' + bodyHash : ''}`;
}

// Cache middleware for API responses
// @param {number} ttlSeconds - Time to live in seconds (default: 300 = 5 min)
// @param {function} keyGenerator - Optional custom key generator
// @param {function} condition - Optional condition

function cacheResponse(ttlSeconds = 300, keyGenerator = null, condition = null) {
    return (req, res, next) => {
        // Only cache GET requests by default
        if (req.method !== 'GET') {
            return next();
        }

        // Check custom condition
        if (condition && !condition(req)) return next();

        // Skip if cache is disabled for this request
        if (req.headers['x-no-cache']) return next();

        const cacheKey = keyGenerator ? keyGenerator(req) : generateCacheKey(req);

        try {
            // Try to get from cache
            const cached = cache.get(cacheKey);
            
            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.status(200).json(cached);
            }

            // Store original json method
            const originalJson = res.json.bind(res);

            res.json = (data) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        cache.set(cacheKey, data, ttlSeconds);
                    } catch (err) {
                        console.error('[Cache Middleware] Failed to cache:', err.message);
                    }
                }
                res.set('X-Cache', 'MISS');
                return originalJson(data);
            };

            next();
        } catch (err) {
            console.error('[Cache Middleware] Error:', err.message);
            next();
        }
    };
}

// Invalidate cache by pattern
// Useful for DELETE/POST/PUT handlers
function invalidateCache(pattern) {
    return (req, res, next) => {
        res.on('finish', () => {
            // Invalidate on successful write operations
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400) {
                try {
                    cache.delPattern(pattern);
                } catch (err) {
                    console.error('[Cache Invalidate] Error:', err.message);
                }
            }
        });
        next();
    };
}

// Cache configuration
const cacheConfigs = {
    // Public data - cache longer
    // 5 minutes
    public: cacheResponse(300),   
    // 1 hour       
    publicLong: cacheResponse(3600),       
    
    // User-specific data - shorter cache
    user: cacheResponse(60),               
    
    // Lists with pagination
    list: cacheResponse(180),         
    
    // Real-time data - no cache
    realtime: (req, res, next) => next()
};

module.exports = {
    cacheResponse,
    invalidateCache,
    cacheConfigs,
    generateCacheKey
};
