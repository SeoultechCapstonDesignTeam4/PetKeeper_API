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
const postRouter = require('./routes/post-route');
const oauthRouter = require('./routes/oauth-route');
const verifyRouter = require('./routes/verify-route');
// const app = express();
const sequelize = require('./models');
// Express 애플리케이션을 초기화합니다.
const app = require('express')();
const cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/pet', petRouter);
app.use('/diag', diagRouter);
app.use('/post', postRouter);
app.use('/auth', oauthRouter);
app.use('/verify', verifyRouter);

const rateLimit = require("express-rate-limit");
// 앱 또는 라우터 레벨에서 제한 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15분 동안
  max: 100,  // 각 IP 주소에서 15분 동안 최대 100개의 요청을 허용
  message: "Too many requests from this IP, please try again later"  // 제한이 초과될 경우의 응답 메시지
});

//  이 미들웨어를 전체 앱에 적용
app.use(limiter);

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
