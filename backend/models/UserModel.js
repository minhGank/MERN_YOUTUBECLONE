const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribeChannels: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    likeVideos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
    dislikeVideos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
