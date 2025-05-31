const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema({
    
});

const ConnectionRequest =new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
