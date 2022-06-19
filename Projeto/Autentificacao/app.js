var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  User = require("./models/user"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  jwt = require('jsonwebtoken');
var logger = require('morgan');


var mongoBD = 'mongodb://127.0.0.1/RRD';
mongoose.connect(mongoBD, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,'Erro de conexão ao MongoBD'));
db.once('open', function() {
  console.log("Conexão ao MongoBD realizada com sucesso!")
})

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(require("express-session")({
  secret: "O Ramalho e fixe",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));

// handeling user sign up
app.post("/registo", function (req, res) {
  console.log(req.body);
  //console.log(req.body.password);
  User.register(new User({ username: req.body.username, email: req.body.email, image:"/images/penguim2.png", level : req.body.level}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).jsonp({
        message: 'Erro no registo', user: user
      });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log(err)
      console.log(user)
      if (err || !user) {
        return res.status(500).jsonp({error:"Erro na Autentificação", err:err})
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.status(500).jsonp({error:"Erro no login"})
        }
        // generate a signed son web token with the contents of user object and return it in the response
        var userTosend = {}
        userTosend.id = user._id
        userTosend.level = user.level
        userTosend.username = user.username
        userTosend.image = user.image
        jwt.sign({ _id:user._id, level: user.level, username: user.username}, 'O Ramalho e fixe',
                {expiresIn: '60m'}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Erro na geração de token"})
                  else res.status(201).jsonp({token:token,  userData:userTosend})
        });
      });
    })(req, res);
  });
});

// Login Logic
// middleware
app.post("/login", function (req, res) {
  console.log('entra aqui')
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right', user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).jsonp({error:"Erro no login"});
      }

      var userTosend = {}
      userTosend.id = user._id
      userTosend.level = user.level
      userTosend.username = user.username
      userTosend.image = user.image

      // generate a signed son web token with the contents of user object and return it in the response
      jwt.sign({ _id:user._id, level: user.level, username: user.username}, 'O Ramalho e fixe',
                {expiresIn: '60m'}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Erro na geração de token"})
                  else res.status(201).jsonp({token:token, userData:userTosend})
        });
    });
  })(req, res);

});

// Logout
app.get("/logout", function (req, res) {
  req.logout();
});

// check isLoggedIn
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


app.listen(7001, process.env.IP, function () {
  console.log("Servidor à escuta na porta 7001...")
});
