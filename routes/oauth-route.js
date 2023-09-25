var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var jwt = require('jsonwebtoken');

var router = express.Router();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, JWT_SECRET } = process.env;

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
