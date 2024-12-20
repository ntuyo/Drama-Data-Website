/*
  app.js -- This creates an Express webserver with login/register/logout authentication
*/

// *********************************************************** //
//  Loading packages to support the server
// *********************************************************** //
// First we load in all of the packages we need for the server...
const createError = require("http-errors"); // to handle the server errors
const express = require("express");

const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const debug = require("debug")("personalapp:server"); 
const layouts = require("express-ejs-layouts");
const axios = require("axios")

// *********************************************************** //
//  Loading models
// *********************************************************** //
const Review = require("./models/Review")
const OldReview = require("./models/OldReview")
const Drama = require("./models/Drama")
const Episode = require("./models/Episode")
// TODO: Load models


// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const oldreviews = require('./public/data/dramadata0418-0521.json')

// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
const mongodb_URI = 'mongodb+srv://tracker2:stemisbae12345@cluster0.cr2ng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const mongodb_URI = process.env.mongodb_URI
mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Issue:'));
db.once('open', function() {console.log("Connected to Drama Database")});

// *********************************************************** //
// Initializing the Express server 
// This code is run once when the app is started and it creates
// a server that respond to requests by sending responses
// *********************************************************** //
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// this allows us to use page layout for the views 
// so we don't have to repeat the headers and footers on every page ...
// the layout is in views/layout.ejs
app.use(layouts);

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

// *********************************************************** //
//  Defining the routes the Express server will respond to
// *********************************************************** //

// login code
// here is the code which handles all /login /signin /logout routes
const auth = require('./routes/auth');
const { deflateSync } = require("zlib");
app.use(auth)

// // middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

// specify that the server should render the views/index.ejs page for the root path
// and the index.ejs code will be wrapped in the views/layouts.ejs code which provides
// the headers and footers for all webpages generated by this app
app.get("/olddramareviews",
   // redirect to /login if user is not logged in
  async (req,res,next) => {
      // let userId = res.locals.user._id;  // get the user's id
      let oldreviews = await OldReview.find()
      res.locals.oldreviews = oldreviews;
  res.render("olddramareviews");
});

app.get("/about", (req, res, next) => {
  res.render("about");
});

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/dramalist",
  async (req,res,next) => {
    let userId = res.locals.user._id;  // get the user's id
    let dramalist = await Drama.find({userId:userId})
    res.locals.dramalist = dramalist;
  res.render("dramalist");
});

app.get("/dramalist:dramaoverview", (req, res, next) => {

  res.render("dramaoverview");
});

// this route load in the courses into the database
// or updates the courses if it is a new database
app.get('/upsertDB',
  async (req,res,next) => {
    //await Course.deleteMany({})
    for (oldreview of oldreviews){
      const {name,rating,romanceandchemistry,storyandplot,pathosandproduction,datestarted,datecompleted,review} = oldreview; // get title and description from the body
      await OldReview.findOneAndUpdate({name,rating,romanceandchemistry,storyandplot,pathosandproduction,datestarted,datecompleted,review},oldreview,{upsert:true})
    }
    const num = await OldReview.find({}).count();
    res.send("data uploaded: "+num)
  }
)

app.use(isLoggedIn)

// app.get("/myreviews", (req, res, next) => {
//   res.render("myreviews");
// });

app.get("/myreviews",
  isLoggedIn,   // redirect to /login if user is not logged in
  async (req,res,next) => {
      let userId = res.locals.user._id;  // get the user's id
      let newreviews = await Review.find({userId:userId})
      res.locals.newreviews = newreviews;  //make the items available in the view
      res.render("myreviews");  // render to the toDo page
    }
  )

app.get('/addCourse/:courseId',
  async (req,res,next) => {
    try {
      const courseId = req.params.courseId
      const userId = res.locals.user._id
      // check to make sure it's not already loaded
      const lookup = await Schedule.find({courseId,userId})
      if (lookup.length==0){
        const schedule = new Schedule({courseId,userId})
        await schedule.save()
      }
    } catch(e){
      next(e)
    }
  })


app.get("/addreview", (req, res, next) => {
  res.render("addreview");
});

app.post('/addreview/add',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const {name,rating,romanceandchemistry,storyandplot,pathosandproduction,datestarted,datecompleted,review} = req.body; // get title and description from the body
      const userId = res.locals.user._id; // get the user's id
      let data = {userId,name,rating,romanceandchemistry,storyandplot,pathosandproduction,datestarted,datecompleted,review,} // create the data object
      let item = new Review(data) // create the database object (and test the types are correct)
      await item.save() // save the todo item in the database
      res.redirect('/myreviews')  // go back to the todo page
    } catch (e){
      next(e);
    }
  }
  )

app.get('myreviews/remove/:dramaName',
  async(req, res, next) => {
    try {
      await ReviewList.remove(
        {dramaName: req.params.dramaName})
      res.redirect('myreviews/show')
  } catch(e){
    next(e)
  }
})


// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
// notice that the function has four parameters which is how Express indicates it is an error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// *********************************************************** //
//  Starting up the server!
// *********************************************************** //
//Here we set the port to use between 1024 and 65535  (2^16-1)
// const port = process.env.PORT || "5000";
const port = "5000";

app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
