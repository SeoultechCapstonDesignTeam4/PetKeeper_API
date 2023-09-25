const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const jwt = require('jsonwebtoken');

const router = express.Router();

const { 
  NAVER_CLIENT_ID, NAVER_CLIENT_SECRET,NAVER_REDIRECT_URL,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL,
  JWT_SECRET } = process.env;

passport.use(new NaverStrategy({
  clientID: NAVER_CLIENT_ID,
  clientSecret: NAVER_CLIENT_SECRET,
  callbackURL: NAVER_REDIRECT_URL,
  },function (accessToken, refreshToken, profile, cb){
    let token;
    console.log(profile);
    try{
      token = jwt.sign({
        user_id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      }, JWT_SECRET, { expiresIn: '1d' });
      console.log(token);
    }catch(err){
      console.error("Error in NaverStrategy callback:", err);
      return cb(err);
    }
    return cb(null, { profile, token });
  }
))

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback',passport.authenticate('naver', {
failureRedirect: '/login',session: false
}), function(req, res){
  return res.status(200).json({ token: req.user.token });
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_REDIRECT_URL,
  passReqToCallback: true  
}, function(req, accessToken, refreshToken, profile, cb) {
  let token;
  try{
      token = jwt.sign({
          user_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
      }, JWT_SECRET, { expiresIn: '1d' });
  }catch(err){
      console.error("Error in GoogleStrategy callback:", err);
      return cb(err);
  }
  return cb(null, { profile, token });
}));


// 세션을 사용하지 않기 위해 session 옵션을 false로 설정합니다.
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
}));

router.get('/google/callback',
passport.authenticate('google', {
  failureRedirect: '/login', session: false }),
function(req, res) {
  return res.status(200).json({ token: req.user.token });

});

module.exports = router;
