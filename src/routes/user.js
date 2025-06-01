const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photUrl age gender about skills";

// * get all the connection which arre accepted
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // *** This ensures that the logged in user will only recieve the data of other connections not self
    const data = connections.map((val) =>
      !val.fromUserId._id.equals(user._id) ? val.fromUserId : val.toUserId
    );
    // const data= connections.map(val=>val.fromUserId)
    if (!connections) {
      return res.status(400).json({
        message: "There are no connections present",
      });
    }
    if (connections.length === 0) {
      return res.json({
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
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!connection) {
      return res.status(400).json({
        message: "There are no pending requests",
      });
    }
    if (connection.length === 0) {
      return res.json({
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

// * get the feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    let connections;
    let finalData;
    if (
      user.interestedIn === "male" ||
      user.interestedIn === "female" ||
      user.interestedIn === "other"
    ) {
      // by connections and requests
      connections = await ConnectionRequest.find({
        $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      }).select("fromUserId toUserId");
      const usersToHide = new Set();
      connections.forEach((element) => {
        usersToHide.add(element.fromUserId.toString());
        usersToHide.add(element.toUserId.toString());
      });

      // by gender

      finalData = await User.find({
        gender: user.interestedIn,
        $and: [
          { _id: { $nin: Array.from(usersToHide) } },
          { _id: { $ne: user._id } },
        ],
      }).select("firstName lastName age gender photUrl skills about").skip(skip).limit(limit);;
    } else {
      connections = await ConnectionRequest.find({
        $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      }).select("fromUserId toUserId");

      const usersToHide = new Set();
      connections.forEach((element) => {
        usersToHide.add(element.fromUserId.toString());
        usersToHide.add(element.toUserId.toString());
      });

      finalData = await User.find({
        $and: [
          { _id: { $nin: Array.from(usersToHide) } },
          { _id: { $ne: user._id } },
        ],
      }).select("firstName lastName age gender photUrl skills about").skip(skip).limit(limit);
    }
    if (!finalData) {
      return res.status(400).json({
        message: "Could not load the data",
      });
    }
    if (finalData.length === 0) {
      return res.json({
        message: "No user available currently",
      });
    }
    res.json({
      message: "these are matched users",
      data: finalData,
    });
  } catch (e) {
    res.status(400).json({
      message: "ERROR : " + e.message,
    });
  }
});

module.exports = userRouter;
