var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    passport = require('passport'),
    util = require('util'),
    FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID     = "433329796735102",
    FACEBOOK_APP_SECRET = "2445e1119acbdbcab18a6b3ab4b39e99",
    CALLBACK_LOGIN_URL  = "/auth/facebook/callback";

//Passport
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: CALLBACK_LOGIN_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var app = module.exports = express();

app.configure(function(){
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  app.use(express.logger(':method :url :status'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'myfirstblogsecret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', ensureAuthenticated , routes.index);

app.get('/auth/facebook',
  passport.authenticate('facebook'), function(req, res){

});

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/partials/:name', ensureAuthenticated, routes.partials);

var post = new api.Post();
app.get('/posts/list', ensureAuthenticated, post.list);
app.get('/posts/show/:id', ensureAuthenticated, post.show);
app.post('/posts/create', ensureAuthenticated, post.create);
app.put('/posts/update/:id', ensureAuthenticated, post.update);
app.delete('/posts/destroy/:id', ensureAuthenticated, post.destroy);

app.get('*', routes.index);

var port = process.env.PORT || 5000; 
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
