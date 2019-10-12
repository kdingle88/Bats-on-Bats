const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

// Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//===================[Auth Routes]==============================

// Get Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

//Register User
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/bats");
    });
  });
});

// Get Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login User
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/bats",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//Log Out User
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/bats");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
