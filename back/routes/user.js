const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 매번 사용자 정보 복구하기
router.get('/' , async (req, res, next) => {  // GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id }
      });
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attritbutes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attritbutes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attritbutes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        const fullUserWithoutPassword = await User.findOne({
          where: { id: req.user.id },
          attributes: {
            exclude: ['password']
          },
          include: [{
            model: Post,
            attritbutes: ['id'],
          }, {
            model: User,
            as: 'Followings',
            attritbutes: ['id'],
          }, {
            model: User,
            as: 'Followers',
            attritbutes: ['id'],
          }]
        })
        return res.status(200).json(fullUserWithoutPassword);
      });
    })(req, res, next);
  });

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
})

router.post('/', isNotLoggedIn, async (req, res, next) => {    // POST /user
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        const exNick = await User.findOne({
            where: {
                nickname: req.body.nickname,
            }
        });
        if (exUser) {
            alert('이미 사용중인 아이디입니다.');
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        if (exNick) {
            alert('이미 사용중인 닉네임입니다.');
            return res.status(403).send('이미 사용중인 닉네임입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(201).send('ok');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('http://localhost:3000');
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('http://localhost:3000');
});

module.exports = router;
