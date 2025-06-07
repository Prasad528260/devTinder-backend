const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");
const validatePassword = require("../models/user");

// * profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (e) {
    throw new Error("ERROR : " + e.message);
  }
});

// * profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Some fields are not allowed to edit");
    }
    const user = req.user;
    // console.log(user._id);

    const {
      firstName,
      lastName,
      age,
      gender,
      photUrl,
      skills,
      about,
      interestedIn,
    } = req.body;
    const editedUser = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        about,
        age,
        gender,
        photUrl,
        skills,
        interestedIn,
      },
      { new: true, runValidators: true }
    );
    res.json(editedUser);
  } catch (e) {
    res.json({ message: "ERROR : " + e.message });
  }
});

// * /profile/password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword, confirmNewPassword } = req.body;
    if (!user.validatePassword(password)) {
      throw new Error("Not a valid password");
    }
    if (newPassword !== confirmNewPassword) {
      throw new Error("Passwords are not matching");
    }

    const updatePasswordUser = await User.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      { new: true, runValidators: true }
    );
    res.json({
      message: `${user.firstName} your password has been updated successfully.`,
      data: updatePasswordUser,
    });
  } catch (e) {
    res.status(400).json({ message: "ERROR : " + e.message });
  }
});

module.exports = profileRouter;
