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
    const { _id } =await jwt.verify(token, "Dev@TinderPrasad123");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user=user;
    next();
  } catch (e) {
    res.status(400).send("ERROR : " + e.message);
  }
};

module.exports = {
  userAuth,
};
