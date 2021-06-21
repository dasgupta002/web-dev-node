var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var hbs = require('hbs');

var mongo = require('mongodb').MongoClient;
var passport = require('passport');
var strategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var hashutils = require('./utils/encrypt');

var app = express();

mongo.connect('mongodb+srv://dg:100@cluster0.8c3kf.mongodb.net/', { useUnifiedTopology: true }, (error, client) => {
  if(error) throw error;

  var db = client.db('user-profiles');
  var users = db.collection('users');
  app.locals.users = users;
});

passport.use(new strategy((username, password, done) => {
  app.locals.users.findOne({ username }, (error, user) => {
    if(error) return done(error);
    
    if(!user) return done(null, false);
    
    if(user.password != hashutils.hashing(password)) return done(null, false);
    
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'session secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;