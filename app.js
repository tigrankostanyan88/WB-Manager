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

if (process.env.NODE_ENV !== 'production') dotenv.config({ path: './.env' });

// Server Configuration
const Server = require('./src/utils/server');
const Api = require('./src/utils/api');
const ctrls = require('./src/controllers');
const globalErrorHandler = ctrls.error;
const AppError = require('./src/utils/appError');
const DB = require('./src/models');
const { Settings } = DB.models;

const app = express();
app.disable('x-powered-by');

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        'http://localhost:3001'
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

// VIEW ENGINE SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. COMPRESSION (gzip)
app.set('trust proxy', 1);
app.use(compression({
  level: 6, // Default level is better for TTFB (speed)
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));


// 2. STATIC FILES
const staticOptions = {
  etag: true,
  maxAge: '1y',
  immutable: true,
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff')
};

app.use('/admin', express.static(path.join(__dirname, 'public', 'admin'), staticOptions));
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/api/images', express.static(path.join(__dirname, 'public', 'images'), staticOptions));


// 4. BODY PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Enable Etags for views
app.set('etag', 'strong'); 
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 1000 * 1024 * 1024 }}));

// Set logged in user for all views (navigation avatar)
const authService = require('./src/services/auth');
app.use(authService.isLoggedIn);


// LOGGING
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// RATE LIMIT (API ONLY)
const limiter = rateLimit({
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: 'Այս IP-ից չափազանց շատ հարցումներ են ուղարկվել, խնդրում ենք կրկին փորձել մեկ ժամից։'
});

const authLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: { message: 'Այս IP-ից մուտք գործելու չափազանց շատ փորձեր կան, խնդրում ենք կրկին փորձել մեկ ժամից։' }
});

const readLimiter = rateLimit({
  max: 5000, 
  windowMs: 60 * 1000,
  message: { message: 'Չափազանց շատ ընթերցման հարցումներ կան, խնդրում ենք կրկին փորձել մեկ ժամից։' }
});

// Apply limiters
app.use('/api/v1/users/signIn', authLimiter);
app.use('/api/v1/tests', readLimiter); 
app.use('/api', limiter);

// REQUEST TIME
app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// CACHE CONTROL
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) res.set('Cache-Control', 'no-store');
  next();
});

// API ROUTES
Api(app);

// 404 HANDLER
app.all('*', async (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next(new AppError(`Հնարավոր չէ գտնել ${req.originalUrl}-ը այս սերվերի վրա!`, 404));

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

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// START SERVER
Server(app);
