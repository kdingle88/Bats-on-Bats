const Bat = require("../models/bats");
const Comment = require("../models/comments");

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middleware.checkBatOwnership = (req, res, next) => {
  //is user logged in
  if (req.isAuthenticated()) {
    // Find Bat in database + Handle errors
    Bat.findById(req.params.id, (err, foundBat) => {
      if (err || !foundBat) {
        req.flash("error", "Bat not found");
        res.redirect("back");
      } else {
        // Check to see if logged in user is equal to bat's author
        if (foundBat.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middleware.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

module.exports = middleware;
