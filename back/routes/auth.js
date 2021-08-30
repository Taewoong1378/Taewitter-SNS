// const express = require('express');
// const router = express.Router();
// const passport = require('passport');

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: process.env.NODE_ENV === 'production' ? 'https://taewitter.com' : 'http://localhost:3060',
// }), (req, res) => {
//   console.log(req.user.nickname);
//   console.log(req.query.code);
//   console.log(req.user.accessToken);
//   res.status(200).json({ nickname: req.user.nickname, accessToken: req.user.accessToken });
//   res.redirect(process.env.NODE_ENV === 'production' ? 'https://taewitter.com' : 'http://localhost:3060');
// });

// router.get('/naver', passport.authenticate('naver'));

// router.get('/naver/callback', passport.authenticate('naver', {
//   failureRedirect: '/',
// }), (req, res) => {
//   res.redirect('http://localhost:3000');
// });

// module.exports = router;
