const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const jwt = require('jsonwebtoken');

const router = express.Router();

const OAUTH_CONFIG = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
  },
  naver: {
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_REDIRECT_URL,
  },
  kakao: {
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_REDIRECT_URL,
  }
};

const generateToken = (profile) => {
  return jwt.sign({
    user_id: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const handleOAuthCallback = (provider) => {
  return (accessToken, refreshToken, profile, cb) => {
    let token;
    try {
      token = generateToken(profile);
    } catch(err) {
      console.error(`Error in ${provider}Strategy callback:`, err);
      return cb(err);
    }
    cb(null, { profile, token, accessToken });
  };
};

passport.use(new KakaoStrategy(OAUTH_CONFIG.kakao, handleOAuthCallback('kakao')));
passport.use(new NaverStrategy(OAUTH_CONFIG.naver, handleOAuthCallback('naver')));
passport.use(new GoogleStrategy(Object.assign(OAUTH_CONFIG.google, { passReqToCallback: true }), handleOAuthCallback('google')));

const authenticateAndRespond = (service) => {
  return [
    passport.authenticate(service, { failureRedirect: '/login', session: false }),
    (req, res) => res.status(200).json({ token: req.user.accessToken })
  ];
};

router.get('/naver', passport.authenticate('naver'));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', ...authenticateAndRespond('kakao'));
router.get('/naver/callback', ...authenticateAndRespond('naver'));
router.get('/google/callback', ...authenticateAndRespond('google'));

module.exports = router;


// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const NaverStrategy = require('passport-naver').Strategy;
// const KakaoStrategy = require('passport-kakao').Strategy;
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// const { 
//   NAVER_CLIENT_ID, NAVER_CLIENT_SECRET,NAVER_REDIRECT_URL,
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL,
//   KAKAO_CLIENT_ID, KAKAO_REDIRECT_URL,
//   JWT_SECRET } = process.env;

// passport.use(new KakaoStrategy({
//   clientID: KAKAO_CLIENT_ID,
//   callbackURL: KAKAO_REDIRECT_URL,
// }, function(accessToken, refreshToken, profile, done) {
//   console.log(profile);
//   try{
//     const token = jwt.sign({
//       user_id: profile.id,
//       email: profile._json.kakao_account.email,
//       name: profile.displayName,
//   }, JWT_SECRET, { expiresIn: '1d' });
//   return done(null, { profile, token, accessToken });
//   }catch(err){
//     console.error("Error in KakaoStrategy callback:", err);
//     return done(err);
//   }
// }));

// passport.use(new NaverStrategy({
//   clientID: NAVER_CLIENT_ID,
//   clientSecret: NAVER_CLIENT_SECRET,
//   callbackURL: NAVER_REDIRECT_URL,
//   },function (accessToken, refreshToken, profile, cb){
//     let token;
//     console.log(profile);
//     try{
//       token = jwt.sign({
//         user_id: profile.id,
//         email: profile.emails[0].value,
//         name: profile.displayName,
//       }, JWT_SECRET, { expiresIn: '1d' });
//       console.log(token);
//     }catch(err){
//       console.error("Error in NaverStrategy callback:", err);
//       return cb(err);
//     }
//     return cb(null, { profile, token, accessToken });
//   }
// ))



// passport.use(new GoogleStrategy({
//   clientID: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: GOOGLE_REDIRECT_URL,
//   passReqToCallback: true  
// }, async function(req, accessToken, refreshToken, profile, cb) {
//   console.log(accessToken);
//   let token;
//   try{
//       token = jwt.sign({
//           user_id: profile.id,
//           email: profile.emails[0].value,
//           name: profile.displayName,
//       }, JWT_SECRET, { expiresIn: '1d' });
//   }catch(err){
//       console.error("Error in GoogleStrategy callback:", err);
//       return cb(err);
//   }
//   return cb(null, { profile, token, accessToken });
// }));

// router.get('/naver', passport.authenticate('naver'));


// router.get('/google', passport.authenticate('google',{scope: ['profile', 'email'],session: false}));

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback',
//   passport.authenticate('kakao', { failureRedirect: '/login',session: false }),
//   function(req, res) {
//     return res.status(200).json({ token: req.user.accessToken });
//   }
// );
// router.get('/naver/callback',
//   passport.authenticate('naver', { failureRedirect: '/login',session: false}),
//   function(req, res){
//     return res.status(200).json({ token: req.user.accessToken });
//   });

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false}),
//   function(req, res) {
//     return res.status(200).json({ token: req.user.accessToken });
// });

// module.exports = router;
