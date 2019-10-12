const express = require("express");

const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const Bat = require("../models/bats");

// All Bats
router.get("/", (req, res) => {
  Bat.find({}, (err, bats) => {
    if (err) {
      console.log(err);
    } else {
      res.render("bats/index", { bats: bats });
    }
  });
});

// NEW

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("bats/new");
});

// CREATE

router.post("/", middleware.isLoggedIn, (req, res) => {
  Bat.create(req.body.bat, (err, newBat) => {
    if (err) {
      console.log(err);
    } else {
      // Add logged in Author's id and Username to bat
      newBat.author.id = req.user._id;
      newBat.author.username = req.user.username;
      //Save bat
      newBat.save();
      //Redirect
      res.redirect("/bats");
    }
  });
});

//SHOW
router.get("/:id", (req, res) => {
  Bat.findById(req.params.id)
    .populate("comments")
    .exec((err, foundBat) => {
      if (err || !foundBat) {
        req.flash('error', "Bat does not exist")
        res.redirect("back");
      } else {
        res.render("bats/show", { bat: foundBat });
      }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkBatOwnership, (req, res) => {
  Bat.findById(req.params.id, (err, foundBat) => {
    if (err || !foundBat) {
      req.flash("error", "Bat Not Found");
    } else {
      res.render("bats/edit", { bat: foundBat });
    }
  });
});

//UPDATE
router.put("/:id", middleware.checkBatOwnership, (req, res) => {
  Bat.findByIdAndUpdate(req.params.id, req.body.bat, (err, updatedBat) => {
    if (err) {
      req.flash('error',"Bat not updated. Error occured.");
      res.redirect('/bats')
    } else {
      res.redirect("/bats/" + req.params.id);
    }
  });
});

//DELETE
router.delete("/:id", middleware.checkBatOwnership, (req, res) => {
  Bat.findByIdAndRemove(req.params.id, err => {
    if (err) {
      req.flash('error',"Something went wrong during delete. Try again");
      res.redirect('/bats')
    } else {
      res.redirect("/bats");
    }
  });
});

module.exports = router;
