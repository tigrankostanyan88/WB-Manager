module.exports = {
    async get(key) {
        return null;
    },

    async set(key, value, ttl) {
        return true;
    },

    async del(key) {
        // Mock del
        return true;
    }
};
