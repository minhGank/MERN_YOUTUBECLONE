const Comment = require("../models/CommentModel");
const Video = require("../models/VideoModel");
exports.addComment = async (req, res, next) => {
  try {
    const { content, owner, fromVideo } = req.body;
    const addNewComment = await new Comment({
      content,
      owner,
      fromVideo,
    }).save();
    if (!addNewComment) {
      return res.json({ msg: "Comment failed", status: fail });
    }
    return res
      .status(200)
      .json({ msg: "Comment success", addNewComment, status: true });
  } catch (error) {
    console.log(error);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { content, owner } = req.body;
    if (userId != owner) {
      return res.json({
        status: false,
        msg: "You can't edit the comment of others",
      });
    }
    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content: content,
      },
      { new: true }
    );
    if (!updateComment) {
      return res.json({
        status: false,
        msg: "Update comment failed",
      });
    }
    return res
      .status(200)
      .json({ status: true, msg: "Update comment successed", updateComment });
  } catch (error) {
    console.log(error);
  }
};

exports.getCommentfromAVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const checkIfVideoExit = await Video.findById(videoId);
    if (!checkIfVideoExit) {
      return res.json({ status: false, msg: "Comment failed" });
    }
    const commentsFromVideo = await Comment.find({
      fromVideo: videoId,
    });
    if (commentsFromVideo.length === 0) {
      return res.json({ status: true, msg: "There's no comment yet" });
    }
    const sortedComment = commentsFromVideo.sort((a, b) => {
      const result = b.like - b.dislike - (a.like - a.dislike);
      return result;
    });
    return res.status(200).json({ status: true, sortedComment });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const user = req.user.id;
    const findComment = await Comment.findById(commentId);
    const videoThatCommentFrom = await Video.findById(findComment.fromVideo);
    //in case couldn't find the comment
    if (!findComment) {
      return res.json({ status: false, msg: "Delete comment failed" });
    }
    //in case couldn't find the video where the comment from
    if (!videoThatCommentFrom) {
      return res.json({ status: false, msg: "Delete comment failed" });
    }
    if (findComment.owner == user || videoThatCommentFrom.owner == user) {
      await Comment.findByIdAndDelete(commentId);
      return res.json({ status: true, msg: "Comment deleted" });
    } else {
      return res.json({
        status: false,
        msg: "You can't delete the comment that's not yours",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
