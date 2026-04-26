const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const authService = require('../services/auth.service');
const repo = require('../repositories/auth.repository');

// JWT secret validation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET must be defined and at least 32 characters long for security');
  }
  return secret.trim().replace(/^"|"$/g, '');
};

const JWT_SECRET = getJWTSecret();

// Auth controller: signup, login, logout
const googleAuth = catchAsync(async (req, res, next) => {
  const result = await authService.googleAuth(req, res, next);
  
  res.status(200).json({
    status: 'success',
    token: result.token,
    user: result.user,
    reload: result.reload
  });
});

const authMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new AppError('Token չկա', 401));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Token-ը անվավեր է', 403));
  }
});

const signUp = catchAsync(async (req, res, next) => {
  const result = await authService.signUp(req, res, next);
  
  res.status(201).json({
    status: 'success',
    time: (Date.now() - req.time) + ' ms',
    token: result.token,
    user: result.user,
    reload: result.reload
  });
});

const signUpByAdmin = catchAsync(async (req, res, next) => {
  const result = await authService.signUpByAdmin(req, res, next);
  
  res.status(201).json({
    status: 'success',
    time: (Date.now() - req.time) + ' ms',
    user: result.user
  });
});

const logOut = catchAsync(async (req, res, next) => {
  const result = await authService.logOut(req, res);
  
  // HTML request: redirect instead of JSON
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/');
  }

  res.status(200).json({
    status: 'success',
    message: result.message,
    redirect: result.redirect
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const result = await authService.signIn(req, res, next);
  
  res.status(200).json({
    status: 'success',
    token: result.token,
    user: result.user,
    time: (Date.now() - req.time + ' ms'),
    reload: result.reload
  });
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Դուք իրավասություն չունեք կատարելու այս գործողությունը', 403));
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const result = await authService.forgotPassword(req, res, next);
  
  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const result = await authService.resetPassword(req, res, next);
  
  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

const isLoggedIn = async (req, res, next) => {
  res.locals.user = undefined;

  if (req.cookies.jwt) {
    try {
  // 1) Verify token using centralized JWT secret
  const secret = JWT_SECRET;
  const decoded = jwt.verify(req.cookies.jwt, secret);

      // 2) Check if user still exists (with avatar only for navigation)
      const currentUser = await repo.findById(decoded.id, { includeFiles: true, includeAvatarOnly: true });
      if (!currentUser) {
        res.clearCookie('jwt');
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        res.clearCookie('jwt');
        return next();
      }

      // 4) Check if login token matches (single device login)
      if (decoded.login_token && currentUser.login_token && currentUser.login_token !== decoded.login_token) {
        res.clearCookie('jwt');
        return next();
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.user = currentUser.toJSON ? currentUser.toJSON() : currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const updatePassword = catchAsync(async (req, res, next) => {
  await authService.updatePassword(req, res, next);
  // Note: createSendToken is called inside the service which sends the response
});

const protect = catchAsync(async (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user.toJSON ? req.user.toJSON() : req.user;
    return next();
  }

  let token;

  // 1) Get token from headers or cookies
  if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith('bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'null' || token === 'undefined' || !token.includes('.')) {
    return next(new AppError('Խնդրում ենք մուտք գործել', 401));
  }

  // 2) Verify token using centralized JWT secret
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AppError('Խնդրում ենք կրկին մուտք գործել (Սխալ թոքեն)', 401));
  }

  // 3) Check if user still exists (without files for performance)
  const currentUser = await repo.findById(decoded.id, { includeFiles: false });
  if (!currentUser) {
    return next(new AppError('Այս թոքենին պատկանող օգտատերը այլևս գոյություն չունի', 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Օգտատերը վերջերս փոխել է գաղտնաբառը։ Խնդրում ենք կրկին մուտք գործել', 401));
  }

  // GRANT ACCESS
  req.user = currentUser;
  res.locals.user = currentUser.toJSON ? currentUser.toJSON() : currentUser;

  next();
});

const protectUser = (req, res, next) => {
  if (res.locals.user) {
    // If API request
    if (req.originalUrl && req.originalUrl.startsWith('/api')) {
      return next(new AppError('Դուք արդեն մուտք եք գործել համակարգ:', 400));
    }
    return res.redirect('/');
  }
  next();
};

module.exports = {
  googleAuth,
  authMiddleware,
  signUp,
  signUpByAdmin,
  logOut,
  signIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  isLoggedIn,
  updatePassword,
  protect,
  protectUser
};
