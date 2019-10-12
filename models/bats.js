const mongoose = require("mongoose");

const batSchema = mongoose.Schema({
  nickname: String,
  image: String,
  scareTactic: String,
  scareScore: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bat", batSchema);
