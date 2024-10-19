const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('google', (req, res) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account', // 設定可以選擇登入的帳號
  });
});

module.exports = router;
