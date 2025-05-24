const express = require("express");
const app = express();
const User = require("./models/user");
const connectDb = require("./config/database");
app.use(express.json());

app.post("/signup", async (req, res) => {
  // const userObj={
  //   firstName:"Prasad",
  //   lastName:"Subhedar",
  //   email:"p@gmail.com",
  //   password:"Prasad@123",
  //   age:20,
  //   gender:"Male",
  // };

  // //? creating new user with the data or technically creating a new instance of User model
  // const user=new User(userObj);

  // ? another way
  // const user = new User({
  //   firstName: "Virat",
  //   lastName: "Kohli",
  //   email: "virat@gmail.com",
  //   password: "Virat@123",
  //   age: 38,
  //   gender: "Male",
  // });

  // ? Dynamic way to create instance os user
  const user=new User(req.body);

  //* saving the user to database
  try {
    await user.save();
    res.send("user added successfully");
    // console.log(user);
    
  } catch (err) {
    res.status(400).send("Error saving user to databse" + err.message);
  }
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
