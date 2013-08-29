var express = require('express'),
  httpProxy = require('http-proxy'),
  passport = require('passport'),
  nconf = require('nconf'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load the configuration
nconf.argv()
  .env()
  .file({file: nconf.get('config')});
nconf.defaults({
  'tw5_host': 'localhost',
  'host': 'localhost'
});

// Setup passport
passport.serializeUser(function(user, done) {
  // serialize the _json field
  // Hint: serialize the user_id here
  done(null, user._json);
});

passport.deserializeUser(function(obj, done) {
  // Hint: deserialize the user by its id.
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: nconf.get('client_id'),
    clientSecret: nconf.get('client_secret'),
    callbackURL: nconf.get('mount_point') + '/auth/google/callback'
  }, function(accessToken, refreshToken, profile, done) {
    // Hint: find or create the user in the DB
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  })
);

function isAuthorized(req, user) {
  // Override me for your own need!
  var domain = nconf.get('domain');
  var pattern = new RegExp('.*@' + domain.replace('.', '\\.'));
  return user && user.email.match(pattern);
}

// Setup express application
var proxy = new httpProxy.RoutingProxy();
var app = express()
  .use(express.logger())
  .use(express.cookieParser())
  .use(express.session({secret: nconf.get('session_secret')}))
  .use(passport.initialize())
  .use(passport.session());

app.configure(function() {
  app.use(app.router);
  // proxy to TW5 as fallback.
  app.use(function(req, res) {
    proxy.proxyRequest(req, res, {
      host: nconf.get('tw5_host'),
      port: nconf.get('tw5_port')
    });
  });
});

// Router
app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), function(req, res){
    // handled by google.
  }
);

app.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.all('/*', function(req, res, next) {
  if (req.method == 'GET' || req.method == 'HEAD' || (
      req.isAuthenticated() &&
      isAuthorized(req, req.user))) {
    return next();
  } else {
    res.send(401);
  }
});


app.listen(nconf.get('port'), nconf.get('host'));
