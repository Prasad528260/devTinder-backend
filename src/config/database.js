const mongoose = require("mongoose");
require('dotenv').config(); 
const connectDb = async () => {
  // console.log(process.env.DB_CONNECTION_SECRET);
  
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
};
module.exports=connectDb;

