const keys = require("./config.js");
const express = require('express');
const app = express();
const passport = require("passport-twitter");
const token = keys.accessToken;
const tokenSecret = keys.accessTokenSecret;

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

passport.use(new TwitterStrategy({
    consumerKey: keys.consumerKey,
    consumerSecret: keys.consumerSecret,
    callbackURL: "https://techdegree-project7-megmrob.c9users.io/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
  }
));

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

app.get('/auth/twitter/statuses/user_timeline', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.render('index', {data: res});
});
 

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening");
});