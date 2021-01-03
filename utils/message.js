const dayjs = require("dayjs");
const users = [];

exports.sendMessage = (username, message) => {
  return {
    username,
    message,
    createdAt: dayjs().format("h:mm a"),
  };
};

exports.userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

exports.getUser = id => {
  const user = users.find(user => user.id === id);
  return user;
};

exports.userLeft = id => {
  const index = users.findIndex(user => user.id === id);
  console.log(index);
  if (index !== -1) {
    const user = users[index];
    users.splice(index, 1);
    return user;
  }
};

exports.getRoomUsers = room => {
  return users.filter(user => user.room === room);
};
