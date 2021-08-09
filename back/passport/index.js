const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);  // 세션에 user의 id만 저장
  // 왜 user에 대한 정보 다 저장 안하고 id만 저장하는가? 회원 정보가 많아질 경우, 메모리는 한정돼있기 때문에 id만 저장해준다. 실무에서는 메모리에도 저장하면 안됨. 왜냐하면 굉장히 많은 사용자들이 존재할 수 있기 때문에 따로 메모리 저장 db를 만들어서 관리해줘야된다.
  });

  // { id: 3, 'connect.sid': s%3189203810391280 }


  //serializeUser의 done이 실행되는 순간, 다시 auth.js의 다음 미들웨어로 간다

  // app.js에서 아래와 같은 코드가 실행되면
  // app.use(passport.initialize());
  // app.use(passport.session());
  // deserializerUser가 실행되고, 아래 코드에 id 값을 보내준다
  // user의 모든 정보에 접근할 수 있게됨
  passport.deserializeUser(async(id, done) => {
    try {
      const exUser = await User.findOne({ where: { id }});
      done(null, exUser);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
