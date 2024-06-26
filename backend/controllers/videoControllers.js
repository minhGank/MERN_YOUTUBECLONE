const Video = require("../models/VideoModel");
const User = require("../models/UserModel");
exports.addVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({
      ...other,
      owner: req.user.id,
    });
    await newVideo.save();
    return res.status(200).json({
      status: true,
      msg: "Upload Video Successfully",
      newVideo: newVideo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      msg: "Failed to upload video",
    });
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const findUpdateVideo = await Video.findById(videoId);
    if (!findUpdateVideo) {
      return res.json({ status: false, msg: "Update Video Fail" });
    }
    if (findUpdateVideo.owner != req.user.id) {
      return res.json({
        status: false,
        msg: "Update fail because this is not your video",
      });
    }
    const updateVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: req.body },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: true,
      msg: "Update Success",
      updateVideo: updateVideo,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const findVideo = await Video.findById(videoId);
    if (!findVideo) {
      return res.json({ status: false, msg: "Delete Video Fail" });
    }
    if (findVideo.owner != req.user.id) {
      return res.json({
        status: false,
        msg: "Delete fail because this is not your video",
      });
    }
    await Video.findByIdAndDelete(videoId);
    return res.status(200).json({
      status: true,
      msg: "Delete Success",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.json({ status: false, msg: "Video not found" });
    }
    return res
      .status(200)
      .json({ status: true, msg: "Video Found", video: video });
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.json({ status: false, msg: "Video not found" });
    }
    const updateViewInVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: +1,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      updateViewInVideo: updateViewInVideo,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getRandomVideo = async (req, res, next) => {
  try {
    // const randomVideos = await Video.find({ _id: { $ne: req.user.id } });
    const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
    return res.status(200).json({ status: true, randomVideos: randomVideos });
  } catch (error) {
    console.log(error);
  }
};

exports.getVideofromSubscribeChannel = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userSubscribeChannelList = user.subscribeChannels;
    let videosFromSubscribeChannels = await Promise.all(
      userSubscribeChannelList.map((eachUserId) => {
        return Video.find({
          owner: eachUserId,
        })
          .sort({ createdAt: "desc" })
          .limit(0);
      })
    );

    // if (userSubscribeChannelList.length <= 3) {
    //   videosFromSubscribeChannelsFunction(5);
    // } else {
    //   videosFromSubscribeChannelsFunction(3);
    // }
    return res.status(200).json({ status: true, videosFromSubscribeChannels });
  } catch (error) {
    console.log(error);
  }
};
exports.getTrendVideo = async (req, res, next) => {
  try {
    const trendVideos = await Video.find({ $sort: { views: -1 } });
    return res.status(200).json({ status: true, trendVideos });
  } catch (error) {
    console.log(error);
  }
};

// exports.getVideoByTags = async (req, res, next) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.searchVideo = async (req, res, next) => {
  try {
    const searchQuery = req.query.search;
    const searchQueryWordsArray = searchQuery.split(" ");
    const result1 = await Video.find({
      title: new RegExp(searchQuery, "i"),
    }).sort({
      views: "desc",
    });

    const result2 = await Promise.all(
      searchQueryWordsArray.map((eachWord) => {
        let resultFromEachWordOfQuery = Video.find({
          title: new RegExp(eachWord, "i"),
        })
          .sort({
            views: "desc",
          })
          .limit(20);
        return resultFromEachWordOfQuery;
      })
    );
    //remove the duplicate video in the 2nd result
    const result1Id = new Set();

    result1.map((ele) => {
      return result1Id.add(ele._id);
    });

    const result2flatAndUnique = result2.flat().filter((ele) => {
      if (result1Id.has(ele._id)) {
        return false;
      } else {
        return ele;
      }
    });
    //in case there is no query match
    if (result1.length == 0 && result2flatAndUnique.length == 0) {
      return res.json({
        status: true,
        msg: `There is no video match ${searchQuery}`,
      });
    }

    return res.json({ status: true, result1, result2flatAndUnique });
  } catch (error) {
    console.log(error);
  }
};
