var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var passport = require('passport');

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, {accessToken, profile});
  }
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null,user);
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  module.exports = {passport}

