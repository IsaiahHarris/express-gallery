const express = require('express');
const session = require('express-session');
const Redis = require('connect-redis')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const User = require('./models/User')
const PORT = process.env.PORT || 8080
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  store: new Redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(user)
  return done(null, {
    id: user.id,
    name: user.name
  })
})

passport.deserializeUser((user, done) => {
  console.log('hii')
  new User({ id: user.id }).fetch()
    .then(user => {
      console.log(user);
      user = user.toJSON();
      return done(null, {
        id: user.id,
        name: user.name
      })
    })
    .catch(err => {
      console.log(err);
      return done(err);
    })
})

passport.use(new LocalStrategy({
  usernameField: 'email'
},function (email, password, done) {
  return new User({ email })
    .fetch()
    .then(user => {
      console.log(user);
      
      if (user === null) {
        return done(null, false, { message: 'bad email or password' })
      } else {
        user = user.toJSON()
        if (password === user.password) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'bad email or password' })
        }
      }
    })
    .catch(err => {
      return done(err);
    })
}))
app.get('/login', (req, res) => {
  res.render('gallery/login')
})

app.post('/register', (req, res) => {
  return new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
    .save()
    .then(user => {
      console.log(user)
      res.redirect('/arts')
    })
    .catch(err => {
      console.log(err);
      return res.send('could not register you')
    })
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/arts',
  failureRedirect: '/login'
}))

app.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200)
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/arts')
  }
}

app.get('/secret', isAuthenticated, (req, res) => {
  res.send('you found the secret')
})
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.set('view engine', '.hbs');

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`)
})

module.exports = {
  isAuthenticated: isAuthenticated
}