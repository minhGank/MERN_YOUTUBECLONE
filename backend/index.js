const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const videoRoutes = require("./routes/videoRoutes");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(authRoutes);
app.use(userRoutes);
app.use(videoRoutes);
app.use(commentRoutes);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(7000, () => {
  console.log("server connected at port 7000");
});
