///////////////////////////Variables/////////////////////////////////////////
//grab the config variables
const keys = require("./public/js/config.js");
//set Express npm
const express = require('express');
const app = express();
//set twitter npm
const twit = require("twit");
//set bodyParser npm (express no longer has this built in)
const bodyParser = require("body-parser");

//start new twit connection
const Twit = new twit({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

//store data received
const userData = [];
const friendsData = [];
const statusData = [];
const dMessages = [];

///////////////////////////////////////TWITTER USERNAME/////////////////////////
//since some of the calls require a screen_name, feel free to change this variable
//when grading to match your twitter account if you don't want to see my tweets
const user = 'miss_pylons';

//set Pug as the view engine
app.set('view engine', 'pug');
//set the css to be accessible via static
app.use('/static', express.static('public'));
//use the bodyParser to grab form inputs on submit
app.use(bodyParser.urlencoded({extended: false}));

//grab info about myself, set them in an object and push to the userData array
//send error out if there is one
//Using this to get avatar and banner url as well as the rest of the details
Twit.get('users/show', { screen_name: user }, function (err, data, response, next) {
  //grab and set the info needed from the data
  let user = {
    displayName: data.name,
    username: `@${data.screen_name}`,
    friends: data.friends_count,
    avatar: data.profile_image_url_https,
    banner: data.profile_banner_url
  }
  //push user info to the array
  userData.push(user);
  //send error if there is one
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get user information.');
    return next(err);
  }
});

//grab last 5 friends from twitter, set their info, and push to the array
//send error out if there is one
Twit.get('friends/list', { count: 5 }, function (err, data, response, next) {
  //iterate through the data to grab and set the info needed
  for (let i = 0; i < data.users.length; i++) {
    let friends = {
      username: `@${data.users[i].screen_name}`,
      displayName: data.users[i].name,
      image: data.users[i].profile_image_url_https
    }
    //push each friend info to the array
    friendsData.push(friends);
  }
  //send error if there is one
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get friends list.');
    return next(err);
  }
});

//grab last 5 statuses from twitter, set their info, and push to the array
//send error out if there is one
//Using this grab in order to only get my tweets and not the "home_timeline" which gets my tweets and my followers tweets
Twit.get('statuses/user_timeline', { screen_name: user, count: 5 }, function (err, data, response, next) {
  //iterate through the data to grab and set the info needed
  for ( let i = 0; i < data.length; i++) {
    let date = new Date(Date.parse(data[i].created_at));
    let status = {
      message: data[i].text,
      retweets: data[i].retweet_count,
      favorites: data[i].favorite_count,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
    //push each status info to the array
    statusData.push(status);
  }
  //send error if there is one
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get statuses.');
    return next(err);
  }
});

//grab last 5 DMs from twitter, set their info, and push to the array
//send error out if there is one
Twit.get('direct_messages/events/list', { count: 5 }, function (err, data, response, next) {
  //iterate through the data to grab and set the info needed
  for ( let i = 0; i < data.events.length; i ++) {
    let date = new Date(parseInt(data.events[i].created_timestamp));
    let message = {
      message: data.events[i].message_create.message_data.text,
      time: date.toLocaleTimeString('en-US'),
      date: date.toLocaleDateString('en-US')
    }
    //push each message info into the array
    dMessages.push(message);
  }
  //send error if there is one
  if (err) {
    console.error(err);
    let err = new Error('Error connecting to Twitter. Failed to get DMs.');
    return next(err);
  }
});

//render the 'homepage' index.pug with the info grabbed from twitter
app.get('/', (req, res) => {
  if (dMessages[0] != undefined) {
    res.render('index', {user: userData, friends: friendsData, status: statusData, dms: dMessages});
  }
});

//post the new tweet and add it to the page
app.post('/tweet', (req, res, next) => {
  //set the date for the new tweet
  let date = new Date();
  //set the info for the new tweet
  let message = {
    message: req.body.message,
    retweets: 0,
    favorites: 0,
    date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }
  //push the new tweet to the array for displaying
  statusData.unshift(message);
  //get rid of the last tweet ibn the array to only show the 5 required statuses
  statusData.pop();
  //post the message and send an error if there is one
  Twit.post('statuses/update', { status: req.body.message }, function(err, data, response) {
    if (err) {
      console.error(err);
      let err = new Error('Error connecting to Twitter. Did not post status.');
      return next(err);
    }
  });
  //make sure the data exists to render the page
  if (statusData[0] != undefined) {
      res.render('index', {user: userData, friends: friendsData, status: statusData, dms: dMessages});
    }
});

//if there is an error, display the error page
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//setup the server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening");
});