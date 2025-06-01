const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect !!!`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});


connectionRequestSchema.pre("save", function (next) {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("Cannot send connectio request to yourself !!");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
