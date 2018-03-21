///////////////////////////Variables/////////////////////////////////////////
//grab the config variables
const keys = require("./config.js");
//set Express npm
const express = require('express');
const app = express();
//set twitter npm
const twit = require("twit-promise");
//set bodyParser npm (express no longer has this built in)
const bodyParser = require("body-parser");

//start new twit connection
const Twit = new twit(keys);


//store data received
const userData = [];
const friendsData = [];
const statusData = [];
const dMessages = [];


//set Pug as the view engine
app.set('view engine', 'pug');
//set the css to be accessible via static
app.use('/static', express.static('public'));
//use the bodyParser to grab form inputs on submit
app.use(bodyParser.urlencoded({extended: false}));

//grab info about myself, set them in an object and push to the userData array
//send error out if there is one
//Using this to get avatar and banner url as well as the rest of the details
Twit.get('account/verify_credentials').then( function (data) {
  let user = {
    displayName: data.data.name,
    username: `@${data.data.screen_name}`,
    friends: data.data.friends_count,
    avatar: data.data.profile_image_url_https,
    banner: data.data.profile_banner_url
  }
  //push user info to the array
  userData.push(user);
  //send error if there is one
}).catch( error => {
  let err = new Error('Error connecting to Twitter. Failed to get screen name.');
  console.error(err);
});

//grab last 5 friends from twitter, set their info, and push to the array
//send error out if there is one
Twit.get('friends/list', { count: 5 }).then( function (data) {
  //iterate through the data to grab and set the info needed
  for (let i = 0; i < data.data.users.length; i++) {
    let friends = {
      username: `@${data.data.users[i].screen_name}`,
      displayName: data.data.users[i].name,
      image: data.data.users[i].profile_image_url_https
    }
    //push each friend info to the array
    friendsData.push(friends);
  }
}).catch( error => {
  //send error if there is one
  let err = new Error('Error connecting to Twitter. Failed to get friends list.');
  console.error(err);
});


//grab last 5 statuses from twitter, set their info, and push to the array
//send error out if there is one
//Using this grab in order to only get my tweets and not the "home_timeline" which gets my tweets and my followers tweets
Twit.get('statuses/user_timeline', { screen_name: userData.displayName, count: 5 }).then( function (data) {
  //iterate through the data to grab and set the info needed
  for ( let i = 0; i < data.data.length; i++) {
    let date = new Date(Date.parse(data.data[i].created_at));
    let status = {
      message: data.data[i].text,
      retweets: data.data[i].retweet_count,
      favorites: data.data[i].favorite_count,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
    //push each status info to the array
    statusData.push(status);
  }
}).catch( error => {
  //send error if there is one
  let err = new Error('Error connecting to Twitter. Failed to get statuses.');
  console.error(err);
});

//grab last 5 DMs from twitter, set their info, and push to the array
//send error out if there is one
Twit.get('direct_messages/events/list', { count: 5 }).then( function (data) {
  //iterate through the data to grab and set the info needed
  for ( let i = 0; i < data.data.events.length; i ++) {
    let date = new Date(parseInt(data.data.events[i].created_timestamp));
    let message = {
      message: data.data.events[i].message_create.message_data.text,
      time: date.toLocaleTimeString('en-US'),
      date: date.toLocaleDateString('en-US')
    }
    //push each message info into the array
    dMessages.push(message);
  }
}).catch( error => {
  //send error if there is one
  let err = new Error('Error connecting to Twitter. Failed to get DMs.');
  console.error(err);
});

//render the 'homepage' index.pug with the info grabbed from twitter
app.get('/', (req, res) => {
    res.render('index', {
      user: userData, 
      friends: friendsData, 
      status: statusData, 
      dms: dMessages
    });
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

//404 error
app.use((req, res, next) => {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
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