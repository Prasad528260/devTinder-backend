const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId",userAuth ,async (req, res) => {
  const {  targetUserId } = req.params;
  const userId=req.user._id;
  try {
    let chat = await Chat.find({
      participants: { $all: [userId, targetUserId] },
    }).populate({
        path:"messages.senderId",
        select:"firtName lastName"});
    if (!chat) {
        chat = new Chat({
            participants:[userId, targetUserId],
            messages:[],
        })
        await chat.save()
    }
    res.json(chat)
    
  } catch (error) {}
});

module.exports = chatRouter;
