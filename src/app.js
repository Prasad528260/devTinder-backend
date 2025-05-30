const express = require("express");
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
const authRouter= require("./routes/auth")
const profileRouter= require("./routes/profile")
const requestRouter= require("./routes/request")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

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
