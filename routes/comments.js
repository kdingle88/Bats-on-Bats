const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const Bat = require("../models/bats");

const Comment = require("../models/comments");

// Comments Routes =========================================
//New Comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Bat.findById(req.params.id, (err, bat) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new.ejs", { bat: bat });
    }
  });
});

// Create Comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  Bat.findById(req.params.id, (err, bat) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add logged in username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();

          bat.comments.push(comment);
          bat.save();
          console.log("Comment Created");

          res.redirect(`/bats/${bat._id}`);
        }
      });
    }
  });
});

//Edit Comment form
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Bat.findById(req.params.id, (err, foundBat) => {
      if (err || !foundBat) {
        req.flash("error", "No Bat Found");
        return res.redirect("back");
      }
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
          req.flash("error", "Comment not found");
        } else {
          res.render("comments/edit", {
            bat_id: req.params.id,
            bat: foundBat,
            comment: foundComment
          });
        }
      });
    });
  }
);

//Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    { useFindAndModify: false },
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/bats/" + req.params.id);
      }
    }
  );
});

//Delete Comment
router.delete("/:comment_id",middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(
    req.params.comment_id,
    { useFindAndModify: false },
    err => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect('/bats/' + req.params.id)
      }
    }
  );
});

module.exports = router;
