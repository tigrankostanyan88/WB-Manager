const router = require('express').Router();
const { loginLimiter } = require('../utils/limiter');

const ctrls = require('../controllers');

// Public routes - no auth needed
router.post('/signUp', ctrls.auth.isLoggedIn, ctrls.auth.protectUser, ctrls.auth.signUp);
router.post('/signIn', ctrls.auth.isLoggedIn, ctrls.auth.protectUser, loginLimiter, ctrls.auth.signIn);
router.post('/forgotPassword', ctrls.auth.forgotPassword);
router.post('/resetPassword/:token', ctrls.auth.resetPassword);

// Protected routes - require valid JWT
router.get('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.getUsers);
router.get('/suspended', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.getSuspendedUsers);
router.get('/me', ctrls.auth.protect, ctrls.user.getMe);
router.get('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.getUserById);
router.patch('/updateMyPassword', ctrls.auth.protect, ctrls.auth.updatePassword);
router.patch('/updateme', ctrls.auth.protect, ctrls.user.updateMe);
router.delete('/avatar', ctrls.auth.protect, ctrls.user.deleteAvatar);
router.patch('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.updateUser);
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.deleteUser);
router.patch('/:id/restore', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.restoreUser);
router.delete('/:id/permanent', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.user.permanentDelete);
router.post('/logout', ctrls.auth.protect, ctrls.auth.logOut);

module.exports = router;
