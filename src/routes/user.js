const express = require("express");
const userRouter = express.Router();
const {userAuth}= require("../middlewares/auth")
const ConnectionRequest= require("../models/connectionRequest")



userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    });
    if (!connections) {
      return res.status(400).json({
        message: "There are no connections present",
      });
    }
    res.status(200).json({
      message: "Connection requests are as follows",
      data: connections,
    });
  } catch (e) {
    res.status(400).json({ message: "ERROR : " + e.message });
  }
});



module.exports = userRouter;
