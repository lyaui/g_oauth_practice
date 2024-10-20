const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  console.log('serialize 使用者');
  done(null, user._id); // serialize 後，將 db 中的 id 存入 session 中內部
  // 並且將 id 簽名後，以 cookie 的形式給使用者...
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log('進入 google strategy 區域');

      // 確認 DB 中是否已有使用者
      const foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log('使用者已註冊過，無須存入 DB');
        done(null, foundUser);
      } else {
        console.log('新用戶，須存入 DB');
        let newUser = User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.picture,
          email: profile.email,
        });
        const savedUser = await newUser.save();
        console.log('成功創建新用戶');
        done(null, savedUser);
      }
    },
  ),
);
