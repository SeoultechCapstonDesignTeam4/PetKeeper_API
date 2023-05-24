const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// .env 파일을 로드합니다.
require("dotenv").config({ path: "./env/development.env" });

const indexRouter = require('./routes/index-route');
const usersRouter = require('./routes/user-route');
const petRouter = require('./routes/pet-route');
const diagRouter = require('./routes/diag-route');
// const app = express();
const sequelize = require('./models');
// Express 애플리케이션을 초기화합니다.
const app = require('express')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/pet', petRouter);
app.use('/diag', diagRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = re q.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
