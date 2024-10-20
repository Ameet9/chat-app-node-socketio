const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "Bot";

app.use(express.static(path.join(__dirname, "public")));

//.............
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // ......welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatApp"));

    //.....single client
    // socket.broadcast.emit(
    //   "message",
    //   formatMessage(botName, "A user has joined the chat")
    // );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //send user and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // //......welcome current user
  // socket.emit("message", formatMessage(botName, "Welcome to ChatApp"));

  // //.....single client
  // socket.broadcast.emit(
  //   "message",
  //   formatMessage(botName, "A user has joined the chat")
  // );

  //........all client
  //io.emit();

  //lister message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //when disconncts
  socket.on("disconnect", () => {
    const userToLeave = userLeave(socket.id);
    if (userToLeave) {
      io.to(userToLeave.room).emit(
        "message",
        formatMessage(botName, `${userToLeave.username} has left the chat`)
      );

      //send user and room info
      io.to(userToLeave.room).emit("roomUsers", {
        room: userToLeave.room,
        users: getRoomUsers(userToLeave.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port ", PORT));
