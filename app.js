//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our Little Secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://Vishal123:Vishal123@cluster0.a8dka.mongodb.net/mentor?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
  username: String,
  Password: String
});
const postSchema = {
  username: String,
  Mobile: String,
  Email: String,
  Address: String,
  Course: String
};

const Post = mongoose.model("Post", postSchema);

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("Home");
});
app.get("/About", function(req, res) {
  res.render("About");
});
app.get("/Courses", function(req, res) {
  res.render("Courses");
});
app.get("/Trainers", function(req, res) {
  res.render("Trainers");
});
app.get("/Events", function(req, res) {
  res.render("Events");
});
app.get("/Pricing", function(req, res) {
  res.render("Pricing");
});
app.get("/Contact", function(req, res) {
  res.render("Contact");
});
app.get("/Registration", function(req, res) {
  res.render("Registration");
});
app.get("/Register", function(req, res) {
  res.render("Register");
});
app.get("/Login", function(req, res) {
  res.render("Login");
});
app.get("/postlog", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("postlog");
  } else {
    res.redirect("/Login");
  }
});
app.post("/Register", function(req, res) {

  User.register({username: req.body.username}, req.body.password ,
    function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/Register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/postlog");
        });
      }
    });

  const post = new Post({
    username: req.body.username,
    Mobile: req.body.Mobile,
    Email: req.body.Email,
    Address: req.body.Address,
    Course: req.body.Course
  });
  post.save();
});
app.post("/Login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/postlog");
      });
    }
  });

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server  has started ");
});
