require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const rootRoute = require("./routes/index");
const db = require("./config/db");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/v1", rootRoute);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", ({ message, to }) => {
    const receiverSocketID = onlineUsers.get(to);
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("msg-recieved", message);
    }
  });

  // socket.on("joinRoom", ({ RoomName, userName }) => {
  //   socket.join(RoomName);
  //   io.to(RoomName).emit("username", `${userName} has joined the room.`);
  // });

  // socket.on("new message", (newMessageRecieved) => {
  //   const { messages, RoomName } = newMessageRecieved;
  //   console.log(messages, RoomName);
  //   io.to(RoomName).emit("message recieved", { messages, id: socket.id });
  // });

  // socket.on("disconnect", () => {
  //   console.log("User Disconnected", socket.id);
  // });
});

const PORT = process.env.PORT || 3000;

db()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database");
    console.log(err);
  });
