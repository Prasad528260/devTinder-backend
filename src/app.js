const express = require("express");
const app = express();
const User = require("./models/user");
const connectDb = require("./config/database");
const user = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  // //? creating new user with the data or technically creating a new instance of User model
  // const user=new User(userObj);

  // ? Dynamic way to create instance os user
  const user = new User(req.body);

  //* saving the user to database
  try {
    await user.save();
    res.send("user added successfully");
    // console.log(user);
  } catch (err) {
    res.status(400).send("Error saving user to databse" + err.message);
  }
});

// * find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    }
    {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error finding user" + err.message);
  }
});

//* Feed ApI -GET/Feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("User not found");
    }
    {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error finding user" + err.message);
  }
});

app.get("/userId", async (req, res) => {
  // const user= await User.findOne({email: req.body.email})
  // const {_id}= user;
  // console.log(_id);
  // const userById= await User.findById(_id);
  const userById = await User.findById({ _id: req.body._id });
  if (userById) {
    res.send(userById);
  } else {
    res.send("user by id not found");
  }
});

// * DELETE A USER
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.body._id });
    res.send("user deleted successfully");
  } catch (e) {
    res.send("failed to delete user");
  }
});

//  * Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const ALLOWED_UPDATES = ["photUrl", "about", "gender", "age", "skills"];
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
);

  if (!isUpdateAllowed) {
    throw new Error("Update not Allowed");
  }
  if (Array.isArray(data?.skills) && data.skills.length > 10) {
  throw new Error("Skills cannot be more than 10");
}


  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after", //return the updated document
      runValidators: true, //validations functions are ran after this permission
    });
    res.send("user updated successfully");
  } catch (error) {
    res.send("failed to update user");
  }
});

//  * Update data of the user by email
// app.patch("/useremail", async (req, res) => {
//   const email = req.body.email;

//   try {
//     const user = await User.findOneAndUpdate({email: email}, req.body);

//     res.send("user updated successfully by email");
//   } catch (error) {
//     res.send("failed to update user by email");
//   }
// });

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
