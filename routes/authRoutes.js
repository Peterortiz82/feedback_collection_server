const passport = require('passport');

module.exports = (app) => {

  // Authenticate with Facebook
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      authType: 'rerequest',
      scope: ['public_profile']
    })
  );

  app.get('/auth/facebook/callback', passport.authenticate('facebook'));

  // Authenticate with Google
  app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));

  // API Routes
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })
};