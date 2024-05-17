const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    videoUrl: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Video = new mongoose.model("Video", videoSchema);

module.exports = Video;
