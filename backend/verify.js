const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.json({ status: false, msg: "Please Sign In" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        req.user = decoded;
        return next();
      }
      if (err) {
        return res.json({ status: false, msg: "Please Sign In" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
