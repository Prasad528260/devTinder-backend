const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signUpValidation } = require("../utils/validation");

// * Signup
authRouter.post("/signup", async (req, res) => {
  // //? creating new user with the data or technically creating a new instance of User model
  // const user=new User(userObj);

  // ? Dynamic way to create instance os user
  //* validations of req using helper function in utils
  signUpValidation(req);
  //* encryptio of password
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  //* saving the user to database
  try {
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json(savedUser);
    // console.log(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error saving user to databse" + err.message });
  }
});

// * Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const passwordValid = await user.validatePassword(password);
    if (!passwordValid) {
      throw new Error("Invalid credentials");
    } else {
      //  create a jwt token to pass in cookie
      const token = await user.getJWT();

      //  add token to cookie and send back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json(user);
    }
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

//* Logout
authRouter.post("/logout", async (req, res) => {
  // * two methods are there you can follow any one

  // const cookie=req.cookies;
  // res.clearCookie("token");

  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Logout successful" });
});

module.exports = authRouter;
