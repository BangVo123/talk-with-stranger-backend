"use strict";

const OnlineUserManager = require("../../../managers/onlineUsers.manager");
const { removeKeys } = require("../../../utils");

module.exports = (socket) => {
  socket.on("message/create", (payload) => {
    global._io
      .to(payload.roomId)
      .emit("message/new", removeKeys(payload, ["roomId"]));
  });
};
