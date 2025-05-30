
const express=require("express");
const profileRouter=express.Router();
const { userAuth } = require("../middlewares/auth");

// * profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    throw new Error("ERROR : " + e.message);
  }
});
module.exports=profileRouter;