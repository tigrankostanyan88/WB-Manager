const user = require('./user')
const payment = require('./payment')

module.exports = {
    // security
    error: require('./error'),
    auth: require('./auth'),
    registration: require('./registration'),
    user: {
        getUsers: user.getUsers,
        getMe: user.getMe,
        updateUser: user.updateUser,
        updateMe: user.updateMe,
        deleteUser: user.deleteUser,
        deleteAvatar: user.deleteAvatar,
        resetGroups: user.resetGroups
    },
    payment: {
        getPayments: payment.getPayments,
        getPaymentById: payment.getPaymentById,
        createPayment: payment.createPayment,
        verifyPayment: payment.verifyPayment,
        deletePayment: payment.deletePayment
    },
    settings: require('./settings'),
    review: require('./review'),
    faq: require('./faq'),
    instructor: require('./instructor'),
    courses: require('./courses'),
    modules: require('./modules'),
    studentCourse: require('./studentCourse'),
};
