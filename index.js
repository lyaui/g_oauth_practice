const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile');

// require 就會自動執行
require('./config/passport');

const mongoose = require('mongoose');
const passport = require('passport');

mongoose
  .connect('mongodb://127.0.0.1:27017/GoogleDB')
  .then(() => {
    console.log('Connecting to mongodb...');
  })
  .catch((e) => {
    console.log(e);
  });

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    // 應該要放 environment variable
    secret: 'Should be an env variable but not for now.',
    // 基本上這兩個不會用到所以直接寫 false 即可
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // 如果是 localhost 的話就要使用 false
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  return res.render('index', { user: req.user });
});

app.listen(8080, () => {
  console.log('Server running on port 8080.');
});
