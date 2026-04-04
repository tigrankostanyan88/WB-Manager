// Express app configuration with security and performance optimizations
const path = require('path');
process.env.UV_THREADPOOL_SIZE = 128;

const dotenv = require('dotenv');
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') dotenv.config({ path: './.env' });

// Server Configuration
const Server = require('./src/utils/server');
const Api = require('./src/utils/api');
const ctrls = require('./src/controllers');
const globalErrorHandler = ctrls.error;
const AppError = require('./src/utils/appError');
const DB = require('./src/models');
const config = require('./src/config/app.config');
const { Settings } = DB.models;

const app = express();
// Security:
app.disable('x-powered-by');

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN,
        ...(process.env.NODE_ENV !== 'production' ? [
          'http://localhost:3000',
          'http://localhost:3001'
        ] : [])
      ].filter(Boolean);
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);

// View engine configuration for server-side rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Compression middleware - gzip responses for faster transfer
app.set('trust proxy', 1);
app.use(compression({
  level: config.COMPRESSION.LEVEL, // Balance between compression ratio and CPU usage
  threshold: 0, // Compress all responses regardless of size
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));


// Security: Optimized static file serving with aggressive caching
const staticOptions = {
  etag: true,
  maxAge: config.CACHE.STATIC_MAX_AGE, // 1 year cache for static assets
  immutable: true, // Files won't change, safe to cache long-term
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // CORS headers for video files to allow seeking/range requests
    if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
      res.setHeader('Access-Control-Allow-Headers', 'Range');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
};

app.use('/admin', express.static(path.join(__dirname, 'public', 'admin'), staticOptions));
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/api/images', express.static(path.join(__dirname, 'public', 'images'), staticOptions));
app.use('/api/files', express.static(path.join(__dirname, 'public', 'files'), staticOptions));


// Body parsers with security limits to prevent DoS attacks
app.use(express.json({ limit: config.UPLOAD.MAX_BODY_SIZE }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD.MAX_BODY_SIZE }));

// Cookie parser with strong ETags for view caching
app.set('etag', 'strong'); 
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: config.UPLOAD.MAX_FILE_SIZE }}));

// Authentication middleware - sets res.locals.user for all routes
const authService = require('./src/services/auth');
app.use(authService.isLoggedIn);


// LOGGING
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// RATE LIMITING - Protect against brute force and DoS attacks

// General API rate limiter
const limiter = rateLimit({
  max: config.RATE_LIMIT.GENERAL_MAX,
  windowMs: config.RATE_LIMIT.GENERAL_WINDOW_MS,
  message: 'Այս IP-ից չափազանց շատ հարցումներ են ուղարկվել, խնդրում ենք կրկին փորձել մեկ ժամից։'
});

// Auth rate limiter to prevent brute force attacks
const authLimiter = rateLimit({
  max: config.RATE_LIMIT.AUTH_MAX,
  windowMs: config.RATE_LIMIT.AUTH_WINDOW_MS,
  message: { message: 'Այս IP-ից մուտք գործելու չափազանց շատ փորձեր կան, խնդրում ենք կրկին փորձել մեկ ժամից։' }
});

// Read rate limiter for heavy read endpoints
const readLimiter = rateLimit({
  max: config.RATE_LIMIT.READ_MAX, 
  windowMs: config.RATE_LIMIT.READ_WINDOW_MS,
  message: { message: 'Չափազանց շատ ընթերցման հարցումներ կան, խնդրում ենք կրկին փորձել մեկ րոպեից։' }
});

// Apply rate limiters to specific routes
app.use('/api/v1/users/signIn', authLimiter);
app.use('/api/v1/tests', readLimiter); 
app.use('/api', limiter);

// Request timing middleware for performance monitoring
app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// API cache control - prevent caching of dynamic API responses
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) res.set('Cache-Control', 'no-store');
  next();
});

// API ROUTES
Api(app);

// 404 handler - gracefully handle unknown routes with SEO-friendly error pages
app.all('*', async (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next(new AppError(`Հնարավոր չէ գտնել ${req.originalUrl}-ը այս սերվերի վրա!`, 404));
  }

  const settings = await Settings.findOne();
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.status(404).render('./notFount/404', {
    title: 'Էջը չի գտնվել (404)',
    description: 'Հասցեն գոյություն չունի կամ տեղափոխվել է',
    canonical: url,
    og_image: './images/404.jpg',
    nav_active: '404',
    page: req.path,
    contact: settings
  });
});

// Global error handler - catches all errors and formats appropriate responses
app.use(globalErrorHandler);

// Start server
Server(app);
