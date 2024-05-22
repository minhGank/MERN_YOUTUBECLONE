const express = require("express");
const router = express.Router();
const { verifyToken } = require("../verify");
const commentController = require("../controllers/commentControllers");

router.post("/addComment", verifyToken, commentController.addComment);
router.post(
  "/editComment/:commentId",
  verifyToken,
  commentController.editComment
);
module.exports = router;
