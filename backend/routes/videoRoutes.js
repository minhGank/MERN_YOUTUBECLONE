const express = require("express");
const router = express.Router();
const { verifyToken } = require("../verify");
const videoControllers = require("../controllers/videoControllers");

router.post("/addVideo", verifyToken, videoControllers.addVideo);
router.put("/updateVideo/:id", verifyToken, videoControllers.updateVideo);
router.put("/deleteVideo/:id", verifyToken, videoControllers.deleteVideo);
router.get("/getVideo/:id", videoControllers.getVideo);
router.put("/view/:id", videoControllers.view);
router.get("/getRandomVideo", videoControllers.getRandomVideo);
router.get(
  "/getVideofromSubscribeChannels",
  verifyToken,
  videoControllers.getVideofromSubscribeChannel
);
router.get("/getTrendVideo", videoControllers.getTrendVideo);
// router.post("/tags", videoControllers.getVideoByTags);
router.get("/search", videoControllers.searchVideo);

module.exports = router;
