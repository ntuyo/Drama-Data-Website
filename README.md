# cs103a-cpa02-ntuyo

Heroku: https://dramatracker.herokuapp.com/

Video: https://drive.google.com/file/d/1M8KGLwni7sR8v7Cx9zHsn2dS0Dy9C2Qd/view?usp=sharing 

# How to use it:

## The front page displays my personal reviews
<a href="https://imgur.com/6h7lhOB"><img src="https://i.imgur.com/6h7lhOB.png" title="Home Page" /></a>

## Click login and create an account to be able to create your own reviews (according to my system!)
<a href="https://imgur.com/GL4RbPE"><img src="https://i.imgur.com/GL4RbPE.png" title="Login Page" /></a>

## You can see your reviews here!
<a href="https://imgur.com/q0Lw5aA"><img src="https://i.imgur.com/q0Lw5aA.png" title="'My Reviews' Page" /></a>

## To add a new review, simply add in the info and click add review! It will show up on your account after
<a href="https://imgur.com/mssSQoU"><img src="https://i.imgur.com/mssSQoU.png" title="Add Review Page" /></a>

# Local Installation
1. Make sure you have mongodb and nodemon installed.
2. Clone this repository
3. On **app.js**, comment out line 39 as seen below, and replace line 38 with your own mongodb database URI
    <img width="386" alt="code to comment out" src="https://user-images.githubusercontent.com/42381986/167410939-de875994-27cd-4bf0-8513-5c95ce17048f.png">
4. Run npm install
5. Run nodemon

# Overview
My goal for this project was to create a drama tracker that helps me to record what I watch. I’m an avid Chinese drama watcher, so for the past year I’ve been trying to figure out how to organize my data. This project was the perfect opportunity for me to do that. On the main page, I have all of my old dramas (2018-2021), which are from an old JSON file that I created last year. I uploaded it to my database as "oldreviews", and access it in my code in order to display them. When you click 'my reviews', you’re prompted to sign in, and then you can add a review from there. I will expand this project by including a drama based API. There are very few that have enough data for a project like the one I would like to do, but there are scrapers available that I will use instead.
