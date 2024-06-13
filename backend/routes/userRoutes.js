const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../verify");

router.put("/:id", verifyToken, userControllers.update);
router.delete("/:id", verifyToken, userControllers.delete);
router.get("/find/:id", userControllers.getUser);
router.put("/subscribe/:id", verifyToken, userControllers.subscribe);
router.put("/unsubcribe/:id", verifyToken, userControllers.unsubscribe);
router.put("/like/:videoId", verifyToken, userControllers.likeVideo);
router.put("/dislike/:videoId", verifyToken, userControllers.dislikeVideo);
router.put("/undislike/:videoId", verifyToken, userControllers.undislikeVideo);
router.put("/unlike/:videoId", verifyToken, userControllers.unlikeVideo);
router.put("/likeComment/:commentId", verifyToken, userControllers.likeComment);
router.put(
  "/dislikeComment/:commentId",
  verifyToken,
  userControllers.dislikeComment
);
router.put(
  "/undislikeComment/:videoId",
  verifyToken,
  userControllers.undislikeComment
);
router.put(
  "/unlikeComment/:videoId",
  verifyToken,
  userControllers.unlikeComment
);
module.exports = router;
