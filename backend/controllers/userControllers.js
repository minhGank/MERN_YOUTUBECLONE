const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");
const Video = require("../models/VideoModel");
exports.update = async (req, res, next) => {
  const userIdFromParams = req.params.id;
  if (req.user.id != userIdFromParams) {
    return res.json({ status: false, msg: "Update failed" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userIdFromParams,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      updatedUser: updatedUser,
      status: true,
      msg: "Update successed",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    if (req.user.id != req.params.id) {
      return res.json({ status: false, msg: "Please Log In" });
    }
    const deletedUser = await User.findById(req.user.id);
    if (!deletedUser) {
      return res.json({ status: false, msg: "User not found" });
    }
    await User.findByIdAndDelete(req.user.id);
    return res.json({ status: true, msg: "User deleted" });
  } catch (error) {
    console.log(error);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const userIdThatToBeFound = req.params.id;
    const userThatToBeFound = await User.findById(userIdThatToBeFound);
    if (!userThatToBeFound) {
      return res.json({ status: false, msg: "User not found" });
    }
    return res.json({ status: true, msg: "User Found" });
  } catch (error) {
    console.log(error);
  }
};

exports.subscribe = async (req, res, next) => {
  try {
    //log the channel id
    const subscribeChannelId = req.params.id;
    //find the channel that user want to subscribe
    const subscribeChannel = await User.findById(subscribeChannelId);
    //in case not found the channel
    if (!subscribeChannel) {
      return res.json({ status: false, msg: "Subscribe Failed" });
    }
    //update the amount of subscriber of the channel
    const newSubscriberAmount = subscribeChannel.subscribers;
    subscribeChannel.subscribe = newSubscriberAmount + 1;
    await subscribeChannel.save();
    //update the subcribe channel list of the user
    const updateUserAfterSubcribe = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          subscribeChannels: subscribeChannel._id,
        },
      },
      { new: true }
    );
    delete updateUserAfterSubcribe.password;
    //send back the data to front end
    return res.status(200).json({
      status: true,
      msg: "Subscribe successfully",
      updateUserAfterSubcribe: updateUserAfterSubcribe,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    //log the channel id
    const subscribeChannelId = req.params.id;
    //find the channel that user want to unsubscribe
    const subscribeChannel = await User.findById(subscribeChannelId);
    //in case not found the channel
    if (!subscribeChannel) {
      return res.json({ status: false, msg: "Unsubscribe Failed" });
    }
    //update the amount of subscriber of the channel
    const newSubscriberAmount = subscribeChannel.subscribers;
    subscribeChannel.subscribe = newSubscriberAmount - 1;
    await subscribeChannel.save();
    //update the subcribe channel list of the user
    const updateUserAfterSubcribe = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          subscribeChannels: subscribeChannel._id,
        },
      },
      { new: true }
    );
    delete updateUserAfterSubcribe.password;
    //send back the data to front end
    return res.status(200).json({
      status: true,
      msg: "Unsubscribe successfully",
      updateUserAfterSubcribe: updateUserAfterSubcribe,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.likeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    //find video
    const video = await Video.findById(videoId);
    //in case cant find video
    if (!video) {
      return res.json({ status: false, msg: "Video not found" });
    }
    const user = await User.findById(req.user.id);

    //check if user liked this video before to prevent the repeat like action

    if (user.likeVideos.includes(video._id)) {
      return res.json({
        status: false,
        msg: "You already liked this video before",
      });
    }
    //end the case
    //update the user by pushing the new like video to the list
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { likeVideos: video._id },
      },
      { new: true }
    );
    //check if User dislike this video before to undislike it

    if (user.dislikeVideos.includes(video._id)) {
      const finalUpdateUser = await User.findByIdAndUpdate(req.user.id, {
        $pull: { dislikeVideos: video._id },
      });
      //update the video
      const updateVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $inc: { like: +1, dislike: -1 },
        },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        msg: "Video Liked",
        updateVideo,
        finalUpdateUser,
      });
    }
    //end of the case
    //in case the video didn't in the dislike list
    const updateVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { like: +1 },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Video Liked", updateUser, updateVideo });
  } catch (error) {
    console.log(error);
  }
};

exports.dislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    //find Video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.json({ status: false, msg: "Video not found" });
    }
    //find user
    const user = await User.findById(req.user.id);
    //check if user already dislike this video before
    if (user.dislikeVideo.includes(video._id)) {
      return res.json({ status: false, msg: "You already disliked the video" });
    }
    //update the user dislike video list
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { dislikeVideos: video._id },
      },
      { new: true }
    );
    //check if User like this video before to unlike it
    const checklikeVideo = updateUser.likeVideos;

    if (checklikeVideo.includes(video._id)) {
      const finalUpdateUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { likeVideos: video._id },
        },
        { new: true }
      );

      const updateVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $inc: { like: -1, dislike: +1 },
        },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        msg: "Video Disliked",
        updateVideo,
        finalUpdateUser,
      });
    }
    //in case user doesn't like the video before
    const updateVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { dislike: +1 },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Video Disliked", updateUser, updateVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.unlikeVideo = async (req, res, next) => {
  try {
    //find video
    const video = await Video.findById(req.params.videoId);
    //find user
    const user = await User.findById(req.user.id);
    //in case couldn't find the video
    if (!video) {
      return res.json({ status: false, msg: "Video doesn't exist" });
    }
    //check if user liked the video
    const checkUserLikedVideoBefore = user.likeVideos.includes(video._id);
    //incase they didn't like the video before
    if (!checkUserLikedVideoBefore) {
      return res.json({
        status: false,
        msg: "Unlike fail because you haven't like it",
      });
    }
    //in case they already liked => update user + update video
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { likeVideos: video._id },
      },
      {
        new: true,
      }
    );
    const updateVideo = await Video.findByIdAndUpdate(
      video._id,
      {
        $inc: { like: -1 },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Video Unliked", updateVideo, updateUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal error, please try again later" });
  }
};

exports.undislikeVideo = async (req, res, next) => {
  try {
    //find video
    const video = await Video.findById(req.params.videoId);
    //find user
    const user = await User.findById(req.user.id);
    //in case couldn't find the video
    if (!video) {
      return res.json({ status: false, msg: "Video doesn't exist" });
    }
    //check if user disliked the video
    const checkUserLikedVideoBefore = user.dislikeVideos.includes(video._id);
    //incase they didn't like the video before
    if (!checkUserLikedVideoBefore) {
      return res.json({
        status: false,
        msg: "Undislike fail because you haven't dislike it",
      });
    }
    //in case they already disliked => update user + update video
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { dislikeVideos: video._id },
      },
      {
        new: true,
      }
    );
    const updateVideo = await Video.findByIdAndUpdate(
      video._id,
      {
        $inc: { dislike: -1 },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Video Undisliked", updateVideo, updateUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal error, please try again later" });
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    //find comment
    const comment = await Comment.findById(commentId);
    //incase couldn't find a comment
    if (!comment) {
      return res.json({ status: false, msg: "Comment not found" });
    }
    //find user
    const user = await User.findById(req.user.id);

    //check if user liked this comment before to prevent the repeat like action
    if (user.likeComment.includes(comment._id)) {
      return res.json({
        status: false,
        msg: "You already liked this comment before",
      });
    }

    //update user

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { likeComment: comment._id },
      },
      { new: true }
    );
    //check if User dislike this comment before to undislike it

    if (user.dislikeComment.includes(comment._id)) {
      const finalUpdateUser = await User.findByIdAndUpdate(req.user.id, {
        $pull: { dislikeComment: comment._id },
      });
      const updateComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $inc: { like: +1, dislike: -1 },
        },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        msg: "Comment Liked",
        updateComment,
        finalUpdateUser,
      });
    }
    //in case user havent dislike the comment before

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: { like: +1 },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Comment Liked", updateUser, updateComment });
  } catch (error) {
    console.log(error);
  }
};

exports.unlikeComment = async (req, res, next) => {
  try {
    //find comment
    const comment = await Comment.findById(req.params.videoId);
    //find user
    const user = await User.findById(req.user.id);
    //in case couldn't find the video
    if (!comment) {
      return res.json({ status: false, msg: "Comment doesn't exist" });
    }
    //check if user liked the comment
    const checkUserLikedCommentBefore = user.likeComment.includes(comment._id);
    //incase they didn't like the comment before
    if (!checkUserLikedCommentBefore) {
      return res.json({
        status: false,
        msg: "Unlike fail because you haven't like it",
      });
    }
    //in case they already liked => update user + update comment
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { likeComment: comment._id },
      },
      {
        new: true,
      }
    );
    const updateComment = await Video.findByIdAndUpdate(
      comment._id,
      {
        $inc: { like: -1 },
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      msg: "Comment Unliked",
      updateComment,
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal error, please try again later" });
  }
};

exports.dislikeComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    //find comment
    const comment = await Comment.findById(commentId);
    //in case couldn't find a comment
    if (!comment) {
      return res.json({ status: false, msg: "Comment not found" });
    }
    //find user
    const user = await User.findById(req.user.id);

    //check if user disliked this comment before to prevent the repeat like action
    if (user.dislikeComment.includes(comment._id)) {
      return res.json({
        status: false,
        msg: "You already disliked this comment before",
      });
    }

    //update user

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { dislikeComment: comment._id },
      },
      { new: true }
    );
    //check if User dislike this comment before to undislike it

    if (user.likeComment.includes(comment._id)) {
      const finalUpdateUser = await User.findByIdAndUpdate(req.user.id, {
        $pull: { likeComment: comment._id },
      });
      const updateComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $inc: { like: -1, dislike: +1 },
        },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        msg: "Comment Disliked",
        updateComment,
        finalUpdateUser,
      });
    }
    //in case user havent dislike the comment before

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: { dislike: +1 },
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      msg: "Comment Disliked",
      updateUser,
      updateComment,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.undislikeComment = async (req, res, next) => {
  try {
    //find comment
    const comment = await Comment.findById(req.params.videoId);
    //find user
    const user = await User.findById(req.user.id);
    //in case couldn't find the video
    if (!comment) {
      return res.json({ status: false, msg: "Comment doesn't exist" });
    }
    //check if user disliked the comment
    const checkUserdisLikedCommentBefore = user.dislikeComment.includes(
      comment._id
    );
    //incase they didn't dislike the comment before
    if (!checkUserdisLikedCommentBefore) {
      return res.json({
        status: false,
        msg: "Undislike fail because you haven't like it",
      });
    }
    //in case they already disliked => update user + update comment
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { dislikeComment: comment._id },
      },
      {
        new: true,
      }
    );
    const updateComment = await Video.findByIdAndUpdate(
      comment._id,
      {
        $inc: { like: -1 },
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      msg: "Comment Undisliked",
      updateComment,
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal error, please try again later" });
  }
};
