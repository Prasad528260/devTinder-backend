const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  // Read token from request cookies
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    // validate the token
    if (!token) {
      throw new Error("Token is Invalid");
    }
    // find the user
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).json({ message: "ERROR : " + e.message });
  }
};

module.exports = {
  userAuth,
};
