const Comment = require("../models/CommentModel");

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
    ).save();
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
