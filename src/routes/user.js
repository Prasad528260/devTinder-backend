const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA="firstName lastName photUrl age gender about skills";

// * get all the connection which arre accepted
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA )
    .populate("toUserId", USER_SAFE_DATA );

// *** This ensures that the logged in user will only recieve the data of other connections not self
    const data= connections.map(val=> (!val.fromUserId._id.equals(user._id) ? val.fromUserId : val.toUserId)  )
    // const data= connections.map(val=>val.fromUserId)
    if (!connections) {
      return res.status(400).json({
        message: "There are no connections present",
      });
    }
    if (connections.length===0) {
         return  res.json({
      message: "There are no Connections",
    });
    }
    res.json({
      message: "Connection requests are as follows",
      data,
    });
  } catch (e) {
    res.status(400).json({ message: "ERROR : " + e.message });
  }
});

// * get all the pending requests
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connection = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId",USER_SAFE_DATA)
    if (!connection) {
      return res.status(400).json({
        message: "There are no pending requests",
      });
    }
    if (connection.length===0) {
        return  res.json({
      message: "There are no pending requests",
      data: connection,
    });
    }

    res.json({
      message: "Following are the pending requests ",
      data: connection,
    });
  } catch (e) {
    res.status(400).json({
      message: "ERROR : " + e.message,
    });
  }
});

module.exports = userRouter;
