const dayjs = require("dayjs");

exports.sendMessage = (username, message) => {
  return {
    username,
    message,
    createdAt: dayjs().format("h:mm a"),
  };
};
