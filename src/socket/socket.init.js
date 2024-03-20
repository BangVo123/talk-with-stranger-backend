"use strict";

const socketRouter = require("../routes/socket/index");
const authentication = require(".././middlewares/authentication");

module.exports = (io) => {
  const onConnection = function (socket) {
    console.log("A socket connection is established");

    socketRouter(socket);

    socket.on("disconnect", function () {
      console.log(`A socket has been disconnected::${this.id}`);
    });
  };

  io.on("connection", onConnection);
};
