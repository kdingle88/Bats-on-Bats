// Will fill each existing Bat with comments

const mongoose = require("mongoose");
const Bat = require("./models/bats");
const Comment = require("./models/comments");

const seedDB = () => {
  Bat.find({}, (err, bats) => {
    if (err) {
      console.log(err);
    } else {
      bats.forEach(bat => {
        Comment.create(
          {
            author: "Jimmy Buckets",
            text:
              'I gets buckets I am the man. That\'s why they call me "Jimmy Buckets" '
          },
          (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              bat.comments.push(comment);
              bat.save();
              console.log(
                "New Comment Created. There will be duplicates if ran more than once"
              );
            }
          }
        );
      });
    }
  });
};

module.exports = seedDB;
