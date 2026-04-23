const path = require('path');
process.env.UV_THREADPOOL_SIZE = 12;

const dotenv = require('dotenv');
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');

if (process.env.NODE_ENV !== 'production') dotenv.config({ path: './.env' });

// SECURITY MODULES
const security = require('./src/security');

const Server = require('./src/utils/server');
const Api = require('./src/utils/api');
const ctrls = require('./src/controllers');
const globalErrorHandler = ctrls.error;
const metrics = require('./src/utils/metrics');
const AppError = require('./src/utils/appError');
const DB = require('./src/models');
const { Contact } = DB.models;

const app = express();
app.disable('x-powered-by');

// 0. TRUST PROXY (Secure Configuration)
app.set('trust proxy', security.trustProxy());

// 1. HELMET (Security Headers - Comprehensive)
app.use(security.helmet);

// 2. CORS (Cross-Origin Resource Sharing)
app.use(security.cors);
app.use(security.corsErrorHandler);

// 3. COMPRESSION (gzip)
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

// 4. STATIC FILES
const staticOptions = {
  etag: true,
  maxAge: '1y',
  immutable: true,
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff')
};

app.use('/admin', express.static(path.join(__dirname, 'public', 'admin'), staticOptions));
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// 5. METRICS
app.use(metrics.middleware);

// 6. BODY PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 7. DATA SANITIZATION (NoSQL injection & XSS prevention)
app.use(security.mongoSanitize);
app.use(security.xss);
app.use(security.hpp);
app.use(security.sanitizeBody);
app.use(security.preventPrototypePollution);

// 8. Enable Etags for views
app.set('etag', 'strong');
app.use(cookieParser());

// 8.5. METHOD OVERRIDE (for HTML forms to use PATCH/DELETE)
app.use(require('method-override')('_method'));

// 9. CSRF TOKEN GENERATION (After cookie parser, before routes)
app.use(security.generateCsrfToken);

app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }}));

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// LOGGING
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// RATE LIMIT (API ONLY)
const limiter = rateLimit({
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: 'Այս IP-ից չափազանց շատ հարցումներ են ուղարկվել, խնդրում ենք կրկին փորձել մեկ ժամից։'
});

const authLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 1000, // 1 minute
  message: { message: 'Այս IP-ից մուտք գործելու չափազանց շատ փորձեր կան, խնդրում ենք կրկին փորձել մեկ ժամից։' }
});

const readLimiter = rateLimit({
  max: 5000, 
  windowMs: 60 * 1000,
  message: { message: 'Չափազանց շատ ընթերցման հարցումներ կան, խնդրում ենք կրկին փորձել մեկ ժամից։' }
});

// Apply limiters
app.use('/api/v1/users/login', authLimiter);
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


// 10. REQUEST TIMEOUT (Prevent Slowloris attacks)
app.use(security.timeoutHandler);
app.use(security.timeoutErrorHandler);

// API ROUTES
Api(app);

// 11. CSRF ERROR HANDLER (Must be after routes)
app.use(security.csrfErrorHandler);

// 404 HANDLER
app.all('*', async (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next(new AppError(`Հնարավոր չէ գտնել ${req.originalUrl}-ը այս սերվերի վրա!`, 404));

  const contact = await Contact.findOne();
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.status(404).render('./notFount/404', {
    title: 'Էջը չի գտնվել (404)',
    description: 'Հասցեն գոյություն չունի կամ տեղափոխվել է',
    canonical: url,
    og_image: './images/404.jpg',
    nav_active: '404',
    page: req.path,
    contact
  });
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// START SERVER
Server(app); 