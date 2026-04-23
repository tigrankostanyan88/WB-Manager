const trustProxy = () => {
    // In production, trust only specific proxies
    if (process.env.NODE_ENV === 'production') {
        // Trust loopback, linklocal, and uniquelocal addresses
        return ['loopback', 'linklocal', 'uniquelocal'];
    }
    
    // In development, trust localhost
    return ['loopback'];
};

// Get client IP safely
const getClientIP = (req) => {
    // Get IP from various headers (in order of trustworthiness)
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];
    
    // Use the leftmost (closest to client) IP from X-Forwarded-For
    if (forwarded) {
        const ips = forwarded.split(',').map(ip => ip.trim());
        // Return the first non-private IP or the first one
        return ips.find(ip => !isPrivateIP(ip)) || ips[0];
    }
    
    if (realIP) return realIP;
    
    return req.ip || req.connection.remoteAddress;
};

// Check if IP is private
const isPrivateIP = (ip) => {
    const privateRanges = [
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^::1$/,
        /^fc00:/i,
        /^fe80:/i
    ];
    
    return privateRanges.some(range => range.test(ip));
};

module.exports = {
    trustProxy,
    getClientIP,
    isPrivateIP
};
