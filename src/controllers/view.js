const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

exports.getDashboard = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        where: {
            role: ['user', 'student']
        }
    });

    res.status(200).render('dashboard', {
        title: 'Dashboard',
        users
    });
});
