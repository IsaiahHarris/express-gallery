const express = require('express');
const app = express();
const session = require('express-session');
const Redis = require('connect-redis')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const routes = require('./routes');
const User = require('./models/User');
const helper = require('./routes/helper');
const flash = require('connect-flash')
const saltedRounds = 12;
const users = require('./routes/users')
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


app.use(flash())
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  if(user.deleted_at === null){
    return done(null, {
      id: user.id,
      name: user.name
    })
  }
})

passport.deserializeUser((user, done) => {
  new User({ id: user.id }).fetch()
    .then(user => {
      if (!user) {
        return done(null, false)
      } else {
        user = user.toJSON();
        return done(null, {
          id: user.id,
          username: user.username
        })
      }
    })
    .catch(err => {
      console.log(err);
      return done(err);
    })
})

passport.use(new LocalStrategy({
  usernameField: 'username'
}, function (username, password, done) {
  return new User({ username })
    .fetch()
    .then(user => {
      if (user === null) {
        return done(null, false, { message: 'bad username or password' })
      } else {
        user = user.toJSON()
        bcrypt.compare(password, user.password)
          .then(samePassword => {
            if (samePassword) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'bad username or password' })
            }
          })
      }
    })
    .catch(err => {
      return done(err);
    })
}))
app.get('/register', (req, res) => {
  res.render('gallery/register',{
    message: req.flash('err')
  })
})

app.get('/login',(req, res) => {
  res.render('login',{
    message: req.flash('error')
  })
})

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltedRounds, (err, salt) => {
    if (err) {
      return res.status(500)
    } else {
      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500)
        } else {
          if(req.body.username.length<1 || req.body.password<1 ){
            req.flash('err', 'Registration requires a username and password!')
            return res.redirect('/register')
          }
          return new User({
            email: req.body.email,
            username: req.body.username,
            password:hashedPassword
          })
            .save()
            .then(user => {
              res.redirect('/arts')
            })
            .catch(err => {
              console.log(err);
              return res.send('could not register you')
            })
        }
      })
    }
  })
})

app.post('/login', (req, res, next) => {
  // console.log("THIS IS REQ", req)
  
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate('local', (err, user, info) => {
    if(user.deleted_at!==null){
      res.render('login',{
        message: 'Wrong username or password!'
      })
    }
    if (err) {
      req.flash('error', `Wrong username or password!`);
      return res.redirect('/login')
    } else if (!user) {
        req.flash('error', `Wrong username or password!`);
        return res.redirect('/login')
    } else if (req.body.username.length < 1 || req.body.password.length < 1) {
      req.flash('error', `Wrong username or password!`);
      return res.redirect('/login')
    }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/arts');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login')
})

app.get('/secret', helper.isAuthenticated, (req, res) => {
  res.send('you found the secret')
})
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.set('view engine', '.hbs');
app.use('/', routes);
app.use('/users', users)

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`)
})