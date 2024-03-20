"use strict";

const OnlineUserManager = require("../../../managers/onlineUsers.manager");

module.exports = (socket) => {
  socket.on("user/connect", (payload) => {
    OnlineUserManager.addConnection(payload);
  });

  socket.on("user/disconnect", (payload) => {
    OnlineUserManager.removeConnection(payload);
  });
};
