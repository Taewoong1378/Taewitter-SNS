const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

const indexRouter = require('./routes');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
};
if(process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
}

app.use(session(sessionOption));
// express-session보다 아래에 위치해야됨. session을 받아서 실행해야하기 때문에.
// passport.session이 실행될 때, index.js의 deserializeUser가 실행된다
app.use(passport.initialize());   // 요청(req 객체)에 passport 설정을 심는다.
app.use(passport.session());  
  
app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.get('/posts', (req, res) => {
    res.json([
        { id: 1, content: 'hello'},
        { id: 2, content: 'hello2'},
        { id: 3, content: 'hello3'},
    ]);
});

// 404처리 미들웨어
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info('hello');
  logger.error(error.message);
  next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  // 개발 모드일 떄는 에러를 보여주게 하고, 배포일 때는 보여주지 않게 하는 코드
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3065, () => {
    console.log('서버 실행 중');
})