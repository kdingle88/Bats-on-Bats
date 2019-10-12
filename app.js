const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Bat = require("./models/bats"),
  Comment = require("./models/comments"),
  User = require("./models/users");
// const seedDB = require("./seed");

const batRoutes = require("./routes/bats"),
  commentRoutes = require("./routes/comments");
indexRoutes = require("./routes/index");

//App Config
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(
  require("express-session")({
    secret: "Jibaritos are amazing",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom Middleware - currentUser data is accessible on all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Requiring the Routes
app.use("/", indexRoutes);
app.use("/bats", batRoutes);
app.use("/bats/:id/comments", commentRoutes);

// seedDB(); Seed the data base with bats and comments

// Create and Connect to the database
mongoose.connect("mongodb://localhost/bats_on_bats", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
