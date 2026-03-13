const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const service = require('../services/auth');
const {
    User
} = require('../models');

module.exports = {
    // SIGN UP
    signUp: catchAsync(async (req, res, next) => {
        const result = await service.signUp(req, res, next);

        res.status(201).json({
            status: 'success',
            token: result.token,
            data: {
                user: result.user
            }
        });
    }),

    // SIGN IN
    signIn: catchAsync(async (req, res, next) => {
        const result = await service.signIn(req, res, next);

        res.status(200).json({
            status: 'success',
            token: result.token,
            data: {
                user: result.user
            }
        });
    }),

    // IS LOGGED IN
    isLoggedIn: service.isLoggedIn,

    // PROTECT ROUTE
    protect: service.protect,
    
    // PROTECT USER
    protectUser: (req, res, next) => {
        service.protectUser(res.locals.user, next);
    },

    // LOG OUT
    logOut: (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Logged out'
        });
    },

    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Դուք չունեք համապատասխան թույլտվություններ'
                });
            }
            next();
        };
    },

    // FORGOT PASSWORD
    forgotPassword: catchAsync(async (req, res, next) => {
        await service.forgotPassword(req, res, next);

        res.status(200).json({
            status: 'success',
            message: 'Հրամանը ուղարկվել է ձեր էլ․ հասցեին'
        });
    }),

    // RESET PASSWORD
    resetPassword: catchAsync(async (req, res, next) => {
        const result = await service.resetPassword(req, res, next);

        res.status(200).json({
            status: 'success',
            token: result.token,
            data: {
                user: result.user
            }
        });
    }),

    // UPDATE PASSWORD
    updatePassword: catchAsync(async (req, res, next) => {
        const result = await service.updatePassword(req, res, next);

        res.status(200).json({
            status: 'success',
            token: result.token,
            data: {
                user: result.user
            }
        });
    })
};