const express = require("express");
const router = express.Router();
const { verifyToken } = require("../verify");
const videoControllers = require("../controllers/videoControllers");

router.post("/addVideo", verifyToken, videoControllers.addVideo);
router.put("/updateVideo/:id", verifyToken, videoControllers.updateVideo);
router.put("/deleteVideo/:id", verifyToken, videoControllers.deleteVideo);
router.get("/getVideo/:id", videoControllers.getVideo);
router.put("/view/:id", videoControllers.getVideo);
router.get("/getRandomVideo", videoControllers.getVideo);
router.get(
  "/getVideofromSubscribeChannels",
  verifyToken,
  videoControllers.getVideo
);
router.get("/getTrendVideo", videoControllers.getVideo);

module.exports = router;