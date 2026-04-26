const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userService = require('../services/user');
const { sanitizeUser } = require('../utils/avatar');

// GET ALL USERS
exports.getUsers = catchAsync(async (req, res) => {
    const { users, fromCache } = await userService.getAll({ excludeRoles: ['admin'] });
    res.status(200).json({
        status: 'success',
        fromCache,
        time: `${Date.now() - req.time} ms`,
        users
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    // Fetch user with avatar only (optimized query)
    const userRepo = require('../repositories/user');
    const userWithFiles = await userRepo.findById(req.user.id, { includeFiles: true });
    const userData = sanitizeUser(userWithFiles);

    res.status(200).json({
        status: 'success',
        user: userData
    });
});

// GET SINGLE USER BY ID
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    const userData = sanitizeUser(user);
    
    res.status(200).json({
        status: 'success',
        user: userData
    });
});

// UPDATE USER 
exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await userService.updateUser(req.params.id, req.body, req.files);
    const userData = sanitizeUser(user);
    
    res.status(200).json({
        status: 'success',
        time: `${Date.now() - req.time} ms`,
        user: userData,
        reload: true
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await userService.updateMe(req.user.id, req.body, req.files);
    const userData = sanitizeUser(user);
    
    res.status(200).json({
        status: 'success',
        time: `${Date.now() - req.time} ms`,
        user: userData,
        reload: true
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    await userService.deleteUser(req.params.id);
    res.status(204).json({ status: 'success' });
});

exports.getSuspendedUsers = catchAsync(async (req, res, next) => {
    const users = await userService.getSuspendedUsers();
    res.status(200).json({
        status: 'success',
        users
    });
});

exports.restoreUser = catchAsync(async (req, res, next) => {
    await userService.restoreUser(req.params.id);
    res.status(200).json({
        status: 'success',
        message: 'Օգտատերը հաջողությամբ վերականգնվեց'
    });
});

exports.permanentDelete = catchAsync(async (req, res, next) => {
    await userService.permanentDeleteUser(req.params.id);
    res.status(200).json({
        status: 'success',
        message: 'Օգտատերը ընդմիշտ ջնջվեց'
    });
});

exports.deleteAvatar = catchAsync(async (req, res, next) => {
    await userService.deleteAvatar(req.user.id);
    res.status(200).json({
        status: 'success',
        time: `${Date.now() - req.time} ms`,
        reload: true
    });
});

exports.resetGroups = catchAsync(async (req, res, next) => {
    await userService.resetGroups(req.user.id);
    res.status(200).json({ status: 'success', message: 'Խմբերի արդյունքները հաջողությամբ զրոյացվեցին' });
});
