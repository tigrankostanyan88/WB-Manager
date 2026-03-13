// Dummy Queue
module.exports = {
    jobQueue: {
        add: async () => ({ id: 'dummy-job-id' }),
        process: () => {},
        on: () => {}
    }
};
