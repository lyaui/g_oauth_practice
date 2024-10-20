const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  return res.render('login');
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account', // 設定可以選擇登入的帳號
  }),
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  return res.redirect('/profile');
});

module.exports = router;
