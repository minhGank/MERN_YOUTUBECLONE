const User = require("../models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    console.log(password, username, email);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashPassword,
      email: email,
    });
    await newUser.save();
    res.status(200).json({ status: true, msg: "User created" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      return res.json({ status: false, msg: "Username is not found" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.json({ status: false, msg: "Password is incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    delete user.password;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ status: true, msg: "Login successed", user: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
