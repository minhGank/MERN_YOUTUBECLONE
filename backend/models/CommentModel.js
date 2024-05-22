const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    fromVideo: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
