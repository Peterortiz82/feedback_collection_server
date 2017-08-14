const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Find or Create User Record
function findOrCreateUserFromOauth(profile, cb) {
  User.findOne({ oauthId: profile.id }).then((existingUser) => {
    if (existingUser) {
      // we already have a record with the given profile ID
      cb(null, existingUser);
    } else {
      // we do not have a a record with the given profile ID, create a new record
      new User({ oauthId: profile.id, displayName: profile.displayName})
        .save()
        .then(user => cb(null, user));
    }
  });
}

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: keys.facebookAppID,
    clientSecret: keys.facebookAppSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName']
  }, (accessToken, refreshToken, profile, cb) => {
    findOrCreateUserFromOauth(profile, cb)
  }
));

// Google Strategy
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, cb) => {
    findOrCreateUserFromOauth(profile, cb)
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  })
});
