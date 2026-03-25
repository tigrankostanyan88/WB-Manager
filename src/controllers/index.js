const user = require('./user')
const payment = require('./payment')
const file = require('./files')

module.exports = {
    // security
    error: require('./error'),
    auth: require('./auth'),
    registration: require('./registration'),
    courseRegistration: require('./courseRegistration'),
    contactMessage: require('./contactMessage'),
    user: {
        getUsers: user.getUsers,
        getMe: user.getMe,
        getUserById: user.getUserById,
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
        deletePayment: payment.deletePayment,
        updatePaymentStatus: payment.updatePaymentStatus,
        getMyPayments: payment.getMyPayments
    },
    file: {
        getFiles: file.getFiles,
        getFileById: file.getFileById,
        updateFile: file.updateFile,
        deleteFile: file.deleteFile
    },
    settings: require('./settings'),
    review: require('./review'),
    faq: require('./faq'),
    instructor: require('./instructor'),
    courses: require('./courses'),
    modules: require('./modules'),
    studentCourse: require('./studentCourse'),
    bankCard: require('./bankCard'),
};
