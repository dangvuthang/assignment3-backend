const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./index");
const http = require("http");
const socketio = require("socket.io");
const {
  sendMessage,
  getUser,
  userJoin,
  userLeft,
  getRoomUsers,
} = require("./utils/message");
const server = http.createServer(app);
const bot = "Chatbox";
const io = socketio(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket => {
  console.log("A new client connect...");
  console.log(socket.id);
  socket.on("joinChat", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", sendMessage(bot, `Welcome to ${bot}, ${username}`));
    socket.broadcast
      .to(user.room)
      .emit("message", sendMessage(bot, `${username} has joined the chat`));
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  socket.on("disconnect", () => {
    const user = userLeft(socket.id);
    console.log(user);
    if (user)
      io.to(user.room).emit(
        "message",
        sendMessage(bot, `${user.username} has left the chat`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  socket.on("chatMessage", message => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", sendMessage(user.username, message));
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
