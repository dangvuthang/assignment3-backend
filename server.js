const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./index");
const http = require("http");
const socketio = require("socket.io");
const { sendMessage } = require("./utils/message");
const server = http.createServer(app);
const bot = "Chatbox";
const io = socketio(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});
const users = [];
const createUser = (id, username) => ({ id, username });
const findUser = id => users.find(user => user.id === id);

io.on("connection", socket => {
  console.log("A new client connect...");
  console.log(socket.id);
  socket.on("joinChat", username => {
    users.push(createUser(socket.id, username));
    console.log("---------------");
    console.log(users);
    console.log("---------------");
    socket.emit("message", sendMessage(bot, `Welcome to ${bot}, ${username}`));
    socket.broadcast.emit(
      "message",
      sendMessage(bot, `${username} has joined the chat`)
    );
  });
  socket.on("disconnect", () => {
    io.emit(
      "message",
      sendMessage(bot, `${findUser(socket.id).username} has left the chat`)
    );
  });
  socket.on("chatMessage", message =>
    io.emit("message", sendMessage(findUser(socket.id).username, message))
  );
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
