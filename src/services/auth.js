const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const Email = require('../utils/Email');
const Validator = require('../utils/validation');
const repo = require('../repositories/auth');
const DB = require('../models');
const User = DB.models.User;

// Cached JWT Secret (computed once)
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET || 'eyu$!923k28@JSi328^7*&jw';
    return secret.trim().replace(/^"|"$/g, '');
})();

// Fast direct SQL update for login token
const fastUpdateLoginToken = async (userId, loginToken) => {
    await DB.con.query(
        'UPDATE users SET login_token = ? WHERE id = ?', {
            replacements: [loginToken, userId],
            type: DB.con.QueryTypes.UPDATE
        }
    );
};

// Create and send JWT token to client
const createSendToken = async (user, statusCode, req, res, target = false) => {
    const loginToken = crypto.randomBytes(32).toString('hex');
    await fastUpdateLoginToken(user.id, loginToken);

    const jwtExpire = req.body && req.body.remember === 'on' ? 60 : 1;

    const token = jwt.sign({
            id: user.id,
            role: user.role,
            login_token: loginToken
        },
        JWT_SECRET, {
            expiresIn: jwtExpire + 'd'
        }
    );

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + jwtExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
    });
    res.locals.token = token;

    if (!target) {
        user.password = undefined;
        res.status(statusCode).json({
            status: 'success',
            token,
            user
        });
    }
};

// Clear JWT cookie (logout)
const logoutUser = (res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
};

// Map user data with avatar for frontend response
const mapUserWithAvatar = (user) => {
    const userData = user.toJSON ? user.toJSON() : user;
    userData.password = undefined;
    userData.deleted = undefined;

    if (userData.files && userData.files.length > 0) {
        userData.avatar = userData.files[0].path_large || userData.files[0].path;
    }

    return userData;
};

// Handle Sequelize unique constraint error
const handleUniqueConstraintError = (err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors ?.[0]?.path;
        const msg = field === 'phone' ?
            'Այս հեռախոսահամարն արդեն գրանցված է։' :
            'Այս էլ․ հասցեն արդեն գրանցված է։';
        const code = field === 'phone' ? 'PHONE_EXISTS' : 'EMAIL_EXISTS';
        return new AppError(msg, 409, code);
    }
    return null;
};

// Handle Sequelize validation error
const handleValidationError = (err) => {
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => {
            if (e.path === 'phone') return 'Հեռախոսահամարը պետք է լինի 0-ով սկսվող 9 նիշ (օր․ 091234567)';
            if (e.path === 'email') return 'Էլ․ հասցեն սխալ է։';
            return e.message;
        });
        return new AppError(messages.join('. '), 400, 'VALIDATION_ERROR');
    }
    return null;
};

const signUp = async (req, res, next) => {
    // Validation
    const validator = new Validator(req.body);
    validator
        .required('email', 'Էլ․ հասցեն')
        .email('email')
        .required('password', 'Գաղտնաբառը')
        .min('password', 6, 'Գաղտնաբառը')
        .required('phone', 'Հեռախոսահամարը')
        .phone('phone')
        .required('name', 'Անունը')
        .validate();

    try {
        const user = await repo.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            password: req.body.password,
            role: 'user'
        });

        await createSendToken(user, 201, req, res, true);

        return {
            token: res.locals.token,
            user: mapUserWithAvatar(user),
            reload: true
        };
    } catch (err) {
        const uniqueError = handleUniqueConstraintError(err);
        if (uniqueError) throw uniqueError;

        const validationError = handleValidationError(err);
        if (validationError) throw validationError;

        throw err;
    }
};

const signIn = async (req, res, next) => {
    const { email,  password } = req.body;

    // Validate Input
    const validator = new Validator(req.body);
    validator.required('email', 'Էլ․ հասցեն').required('password', 'Գաղտնաբառը').validate();

    // Find user (simple - no avatar needed for auth)
    const user = await repo.findByEmailSimple(email);

    // Generic error for security
    const authErr = new AppError('Սխալ էլ․ հասցե կամ գաղտնաբառ։', 401);

    if (!user) throw authErr;
    if (!user.password || typeof user.password !== 'string') throw authErr;

    // Check password
    if (!(await user.correctPassword(password, user.password))) {
        throw authErr;
    }

    // Create and send token
    await createSendToken(user, 200, req, res, true);

    return {
        token: res.locals.token,
        user: mapUserWithAvatar(user),
        reload: true
    };
};

// Verify JWT token and return user
const protect = async (req, res, next) => {
    res.locals.user = undefined;

    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('Դուք մուտք չեք գործել։ Մուտք գործելու համար խնդրում ենք մուտք գործել։', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists (with files for avatar)
        const currentUser = await User.findByPk(decoded.id, {
            include: [{ model: DB.models.File, as: 'files', required: false }]
        });

        if (!currentUser) {
            return next(new AppError('Այս տոկենին պատկանող օգտատերը այլևս գոյություն չունի։', 401));
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Օգտատերը վերջերս փոխել է գաղտնաբառը։ Խնդրում ենք կրկին մուտք գործել։', 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        res.locals.user = currentUser.toJSON();

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Անվավեր տոկեն։ Խնդրում ենք մուտք գործել։', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Ձեր տոկենի ժամկետը սպառվել է։ Խնդրում ենք մուտք գործել։', 401));
        }
        next(err);
    }
};
const protectUser = async (user, next) => {
    if (user) return next(new AppError('Դուք արդեն մուտք եք գործել։', 403));
    next();
};

const isLoggedIn = async (req, res, next) => {
    res.locals.user = undefined;

    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);

            // 2) Check if user still exists (with files for avatar)
            const currentUser = await User.findByPk(decoded.id, {
                include: [{ model: DB.models.File, as: 'files', required: false }]
            });

            if (!currentUser) return next();

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            const userData = currentUser.toJSON ? currentUser.toJSON() : currentUser;
            
            // Add avatar URL for navigation
            if (userData.files && userData.files.length > 0) {
                const f = userData.files.find((x) => x.name_used === 'user_img') || userData.files[0];
                if (f && f.name && f.ext) {
                    userData.avatar = `/images/${f.table_name || 'users'}/large/${f.name}.${f.ext}`;
                }
            }
            
            res.locals.user = userData;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

const logout = async (req, res) => {
    logoutUser(res);
    return {
        message: 'Your successfully logged out!'
    };
};

const logOut = async (req, res) => {
    logoutUser(res);
    return {
        message: 'Օգտատերը դուրս է եկել հաշվից',
        redirect: '/'
    };
};

const forgotPassword = async (req, res, next) => {
    const {
        email
    } = req.body;

    if (!email) {
        throw new AppError('Խնդրում ենք տրամադրել ձեր էլ. փոստը։', 400);
    }

    const user = await repo.findByEmailSimple(email);
    if (!user) {
        throw new AppError('Օգտվողը չի գտնվել։', 404);
    }

    // Generate reset token
    const resetToken = repo.createPasswordResetToken(user);
    await repo.save(user);

    // Send email
    try {
        const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        return {
            message: 'Վերականգնման կոդը ուղարկել ենք էլ․ հասցեին'
        };
    } catch (err) {
        await repo.clearResetToken(user);
        throw new AppError('Էլ․ նամակն ուղարկելիս սխալ տեղի ունեցավ։ Փորձեք կրկին ավելի ուշ։', 500);
    }
};

const resetPassword = async (req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await repo.findByResetToken(hashedToken);

    if (!user) {
        throw new AppError('Թոքենը անվավեր է կամ ժամկետանց է', 401);
    }

    // Update password
    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await repo.save(user);

    return {
        message: 'Գաղտնաբառը հաջողությամբ վերականգնվեց'
    };
};

const updatePassword = async (req, res, next) => {
    // Get user
    const user = await repo.findByIdWithFields(req.user.id, ['id', 'password', 'login_token', 'role']);
    if (!user) {
        throw new AppError('Օգտատերը չի գտնվել', 404);
    }

    // Check current password
    if (!req.body.passwordCurrent || !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        throw new AppError('Ընթացիկ գաղտնաբառը սխալ է', 401);
    }

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    try {
        await repo.save(user);
    } catch (err) {
        throw new AppError('Գաղտնաբառի թարմացման սխալ: ' + err.message, 400);
    }

    // Log user in with new token
    await createSendToken(user, 200, req, res);
};

module.exports = {
    createSendToken,
    logoutUser,
    mapUserWithAvatar,
    isLoggedIn,
    protect,
    signUp,
    signIn,
    logout,
    logOut,
    forgotPassword,
    protectUser,
    resetPassword,
    updatePassword
};