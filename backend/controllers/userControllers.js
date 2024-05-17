const User = require("../models/UserModel");

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
    await findByIdAndDelete(req.user.id);
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

exports.like = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.dislike = async (req, res, next) => {
  try {
  } catch (error) {}
};
