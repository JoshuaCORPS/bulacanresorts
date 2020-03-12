const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Security Middelwares
const hpp = require('hpp');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Routes
const userRouter = require('./routes/userRoutes');
const resortRouter = require('./routes/resortRoutes');
const viewRouter = require('./routes/viewRoutes');

// Controller
const errorController = require('./controller/errorController');
const authController = require('./controller/authController');
const AppError = require('./utils/appError');

const limter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again after an hour.'
});

const app = express();

app.enable('trust proxy');

// Set-up View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Global Middelwares
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/', limter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/resorts', resortRouter);

app.use(authController.isLoggedIn);
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The link "${req.originalUrl}" may be broken or the page
  may have been removed.`,
      404
    )
  );
});

app.use(errorController);

app.disable('x-powered-by');

module.exports = app;
