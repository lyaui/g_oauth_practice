const router = require('express').Router();

// 如果有進行 passport.serializeUser()，就會自動設定 req.isAuthenticated = true
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect('/auth/login');
  }
};

router.get('/', authCheck, (req, res) => {
  console.log('/profile');
  return res.render('profile', { user: req.user }); // deserializeUser()
});

module.exports = router;
