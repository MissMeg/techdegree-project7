const keys = require("./public/js/config.js");
const express = require('express');
const app = express();
const twit = require("twit");

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

const T = new twit({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

T.get('friends/list', { count: 5 }, function (err, data, response) {
  // console.log(data.users[0]);
});

T.get('statuses/home_timeline', { count: 5 }, function (err, data, response) {
  // console.log(data[0]);
});

T.get('direct_messages/events/list', { count: 5 }, function (err, data, response) {
  console.log(data.events[0].message_create.message_data.text);
  
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening");
});