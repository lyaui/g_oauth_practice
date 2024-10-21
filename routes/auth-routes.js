const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  return res.render('login', { user: req.user });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account', // 設定可以選擇登入的帳號
  }),
);

router.get('/signup', (req, res) => {
  return res.render('signup', { user: res.user });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 8) {
    req.flash('error_msg', '密碼長度過短');
    return res.redirect('/auth/signup');
  }

  const foundEmail = await User.findOne({ email }).exec();
  console.log({ foundEmail });
  if (foundEmail) {
    req.flash('error_msg', '信箱已註冊');
    return res.redirect('/auth/signup');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword });
  console.log({ newUser });
  await newUser.save();
  req.flash('success_msg', '註冊成功');
  return res.redirect('/auth/login');
});

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log('/google/redirect');
  return res.redirect('/profile');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.send(err);
    return res.redirect('/');
  });
});

module.exports = router;
