// Memory-based cache (no Redis required)
const cache = new Map();
const timers = new Map();

function get(key) {
    try {
        const item = cache.get(key);
        if (!item) return null;
        
        // Check if expired
        if (item.expiry && Date.now() > item.expiry) {
            cache.delete(key);
            return null;
        }
        
        return item.value;
    } catch (err) {
        console.error('[Cache] Get error:', err.message);
        return null;
    }
}

function set(key, value, ttlSeconds = 300) {
    try {
        // Clear existing timer if any
        if (timers.has(key)) {
            clearTimeout(timers.get(key));
        }
        
        const expiry = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : null;
        cache.set(key, { value, expiry });
        
        // Auto-cleanup after TTL
        if (ttlSeconds > 0) {
            const timer = setTimeout(() => {
                cache.delete(key);
                timers.delete(key);
            }, ttlSeconds * 1000);
            timers.set(key, timer);
        }
        
        return true;
    } catch (err) {
        console.error('[Cache] Set error:', err.message);
        return false;
    }
}

function del(key) {
    try {
        if (timers.has(key)) {
            clearTimeout(timers.get(key));
            timers.delete(key);
        }
        return cache.delete(key);
    } catch (err) {
        console.error('[Cache] Del error:', err.message);
        return false;
    }
}

function delPattern(pattern) {
    try {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        for (const key of cache.keys()) {
            if (regex.test(key)) {
                del(key);
            }
        }
        return true;
    } catch (err) {
        console.error('[Cache] DelPattern error:', err.message);
        return false;
    }
}

function exists(key) {
    const item = cache.get(key);
    if (!item) return false;
    if (item.expiry && Date.now() > item.expiry) {
        del(key);
        return false;
    }
    return true;
}

// Cleanup function for graceful shutdown
function clear() {
    for (const timer of timers.values()) {
        clearTimeout(timer);
    }
    cache.clear();
    timers.clear();
}

module.exports = {
    get,
    set,
    del,
    delPattern,
    exists,
    clear
};
