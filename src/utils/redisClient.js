// Dummy Redis Client
module.exports = {
    get: async () => null,
    set: async () => true,
    del: async () => true,
    incr: async () => 1,
    expire: async () => true,
    sAdd: async () => 1,
    on: () => {},
    connect: async () => {}
};
