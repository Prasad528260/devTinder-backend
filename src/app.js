const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const connectDb = require("./config/database");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
const { signUpValidation } = require("./utils/validation");

// * Signup
app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("user added successfully");
    // console.log(user);
  } catch (err) {
    res.status(400).send("Error saving user to databse" + err.message);
  }
});

// * Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error("Invalid credentials");
    } else {
      //  create a jwt token to pass in cookie
      const token = await jwt.sign({ _id: user._id }, "Dev@TinderPrasad123", {
        expiresIn: "1d",
      });

      //  add token to cookie and send back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() * 8 * 3600000),
      });
      res.send("Login Successful !!");
    }
  } catch (e) {
    res.status(400).send("Error : " + e.message);
  }
});

// * profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    throw new Error("ERROR : " + E.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  console.log(user.firstName + " has sent the connection request");
});

const PORT = 3000;
connectDb()
  .then(() => {
    console.log("database connection successful");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch(() => {
    console.log("database connection failed");
  });
