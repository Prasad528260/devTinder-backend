const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const fromUserId = fromUser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const toUser = await User.findById(toUserId);
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          messsage: "invalid status type " + status,
        });
      }
      // if (fromUserId.equals(toUserId)) {
      //   return res.status(400).send("Cannot send request to yourself");
      // }
      if (!toUser) {
        return res.status(400).json({
          message: "User not found !!!",
        });
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Connection already exist." });
      }

      const connectionRequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const connection = await connectionRequest.save();
      if (connection) {
        res.json({
          message: `${fromUser.firstName} is ${status} in ${toUser.firstName}`,
          data: connection,
        });
      }
    } catch (err) {
      res.status(400).json("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    //* here the request will be accepted or rejected the one who will accept the request will be logged in user

    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const allowedStatus = ["accepted", "rejected"];
      const status = req.params.status;

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed",
        });
      }

      const connection = await ConnectionRequest.findOne({
        toUserId: loggedInUser._id,
        _id: requestId,
        status: "interested",
      });
      if (!connection) {
        return res.status(400).json({
          message: "Connection not allowed",
        });
      }
      connection.status = status;
      const data = await connection.save();
      res.json({
        message: `${loggedInUser.firstName} has ${status} the request.`,
        data,
      });
    } catch (err) {
      res.status(400).json("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
