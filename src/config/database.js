const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tinder:tinder@devtinder.gpodsb.mongodb.net/devTinder"
  );
};
module.exports=connectDb;

