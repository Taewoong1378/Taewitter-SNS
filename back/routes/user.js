const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

router.post('/login', (req, res, next) => {     // POST /user/login
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        if(info) {
            // 401 : 허가되지 않음
            // http 상태코드
            return res.status(401).send(info.message);
        }
        return req.login(user, async (loginErr) => {
            if(loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            // res.setHeader('Cookie', 'cxlhy');
            return res.status(200).json(user);
        });
    })(req, res, next);
});

router.post('/user/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
})

router.post('/', async (req, res, next) => {    // POST /user
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

module.exports = router;
