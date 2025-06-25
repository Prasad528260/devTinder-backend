const socket = require("socket.io");
const { Chat } = require("../models/chat");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });
  io.on("connection", (socket) => {
    // handling the events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName,lastName, userId, targetUserId, text }) => {
        //* save message to databse
        try {
          const roomId = [userId, targetUserId].sort().join("_");
          // console.log(firstName + " joined room : " + roomId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants:  [userId, targetUserId],
              messages:[],
            })
          }
          chat.messages.push({
            senderId:userId,
            text
          })
          io.to(roomId).emit("messageRecieved", { firstName, lastName,text });
        } catch (error) {
          console.log(error.message);
        }

        
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = { initializeSocket };
