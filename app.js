const keys = require("./public/js/config.js");
const express = require('express');
const app = express();
const twit = require("twit");
const bodyParser = require("body-parser");

app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

const T = new twit({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

const userData = [];
const friendsData = [];
const statusData = [];
const dMessages = [];

T.get('users/show', { screen_name: 'miss_pylons' }, function (err, data, response, next) {
  let user = {
    displayName: data.name,
    username: `@${data.screen_name}`,
    followers: data.followers_count,
    friends: data.friends_count,
    avatar: data.profile_image_url_https,
    banner: data.profile_banner_url
  }
  userData.push(user);
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get user information.');
    return next(err);
  }
});

T.get('friends/list', { count: 5 }, function (err, data, response, next) {
  for (let i = 0; i < data.users.length; i++) {
    let friends = {
      username: `@${data.users[i].screen_name}`,
      displayName: data.users[i].name,
      image: data.users[i].profile_image_url_https
    }
    friendsData.push(friends);
  }
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get friends list.');
    return next(err);
  }
});

T.get('statuses/user_timeline', { screen_name: 'miss_pylons', count: 5 }, function (err, data, response, next) {
  for ( let i = 0; i < data.length; i++) {
    let date = new Date(Date.parse(data[i].created_at));
    let status = {
      message: data[i].text,
      retweets: data[i].retweet_count,
      favorites: data[i].favorite_count,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
    statusData.push(status);
  }
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get statuses.');
    return next(err);
  }
});


T.get('direct_messages/events/list', { count: 5 }, function (err, data, response, next) {
  for ( let i = 0; i < data.events.length; i ++) {
    let date = new Date(parseInt(data.events[i].created_timestamp));
    let message = {
      message: data.events[i].message_create.message_data.text,
      time: date.toLocaleTimeString('en-US'),
      date: date.toLocaleDateString('en-US')
    }
    dMessages.push(message);
  }
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get DMs.');
    return next(err);
  }
});

app.get('/', (req, res) => {
  if (dMessages[0] != undefined) {
    res.render('index', {user: userData, friends: friendsData, status: statusData, dms: dMessages});
  }
});

app.post('/tweet', (req, res, next) => {
  let date = new Date();
  let message = {
    message: req.body.message,
    retweets: 0,
    favorites: 0,
    date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }
  statusData.unshift(message);
  T.post('statuses/update', { status: req.body.message }, function(err, data, response) {
    if (err) {
      console.error(err);
      let err = new Error('Error connecting to Twitter. Did not post status.');
      return next(err);
    }
  });
  if (statusData[0] != undefined) {
      res.render('index', {user: userData, friends: friendsData, status: statusData, dms: dMessages});
    }
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening");
});