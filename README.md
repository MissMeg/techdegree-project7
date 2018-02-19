```
____________ _____   ___ _____ _____ _____   ______
| ___ \ ___ \  _  | |_  |  ___/  __ \_   _| |___  /
| |_/ / |_/ / | | |   | | |__ | /  \/ | |      / / 
|  __/|    /| | | |   | |  __|| |     | |     / /  
| |   | |\ \\ \_/ /\__/ / |___| \__/\ | |   ./ /   
\_|   \_| \_|\___/\____/\____/ \____/ \_/   \_/    

-----------------------------------------------------
```

## Project by: Megan Roberts
## Tech Dregree Track: Fullstack JavaScript
## Project Title: Build a Twitter Interface
## Project Requirements:
```
    1) Set up a new Express project in the provided app.js file. You will need to create the following files:
        a) A package.json file that includes your project’s dependencies.
        b) A Jade/Pug template file to display tweets and messages
        c) A config.js file that will contain your application’s authentication code
        d) A .gitignore file to add your config. js and node_modules/ folder to. This will prevent these files from being committed and pushed to github
    2) Create a new Twitter application. This will generate the keys and access tokens you need to authenticate your application so it can communicate with the Twitter API. You can find a link to a tutorial on how to do this in the project resources. Please note that while the tutorial says to create a Twitter dev account at dev.twitter.com, the url to create a Twitter dev account is now https://apps.twitter.com/
    3) To use and interact with the Twitter API, you’ll need to set up a way to give the Twitter API the set of keys and access tokens that were generated when you create your Twitter app. It’s a good idea to use an npm module to help you with this part. For this project, you’ll use an npm module called Twit. You can find a link in the project resources. Be sure to look through the documentation and familiarize yourself with how it works.
        a) Create a file called config.js. In this file, you’ll assign an object literal to the module.exports object, as shown in the Twit documentation. The object literal should have the following properties with their corresponding values from your Twitter application account:
            i)   consumer_key
            ii)  consumer_secret
            iii) access_token
            iv)  access_token_secret
        b) Import this code into your app.js file to authenticate your application so you can request data from the Twitter API. The config.js file must be listed in the .gitignore file so it won’t be committed to your github repository. This will prevent your keys and tokens from getting posted publicly to GitHub. It is very important that you do NOT upload any of your personal API keys / secrets / passwords to Github or other publicly accessible place.
    4) Make a Pug/Jade template for the main page. The template should have spaces for:
        a) your 5 most recent tweets
        b) your 5 most recent friends
        c) your 5 most recent private messages: Note that you don’t have to display direct messages as a back and forth conversation. You only need to display the last 5 messages that were received, or the last 5 messages that were sent.
        d) It should also include your personal Twitter name and profile image at the top of the screen. Styling is not the important part of this project. Craft your template markup to take advantage of the CSS we’ve provided you. Knowing how to work with someone else’s styles is a very important skill as a full-stack developer. Pay attention to class names, inheritance, and so on. Try to avoid element types that are not used in the provided HTML and CSS files.
    5) Using Node and Express, request the data you need from Twitter’s API, render it in your template, and send it to the client at the “/” route. Please avoid using Express generator to set up this project. It will be good practice to set up a simple Express app yourself!
    6) Each rendered result must include all of the information seen in the sample layout:
        a) *tweets -message content -# of retweets -# of likes -date tweeted
        b) *friends -profile image -real name -screenname
        c) *messages -message body -date the message was sent -time the message was sent
    7) Make sure the application actually renders your correct Twitter information by running it on your local machine and comparing it to your recent Twitter activity.
```
## Exceeds Expectations Requirements:
```
    1) Add a section to the bottom of your page that allows a user to post a new tweet. The new tweet should display without having to refresh the page.
    2) Add an error page to your application, so that if anything goes wrong with your routes, the user will see a friendly message rendered, instead of the default error code.
    3) Include your personal background image from Twitter as a background for the page header.
```
## Project Description:
In this project, you'll use Twitter’s REST API to access your Twitter profile information and render it to a user. The page should automatically authenticate access to your Twitter profile. It should use this access to populate three columns on your page:
Your 5 most recent tweets.
Your 5 most recent friends.
Your 5 most recent private messages.
I will be completing all requirements including the exceeds expectations.