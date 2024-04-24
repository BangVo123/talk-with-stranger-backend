"use strict";

module.exports = (socket) => {
  socket.on("user/connect", (payload) => {
    console.log("User connected");
    socket.join(payload.id);
  });

  socket.on("user/disconnect", (payload) => {
    console.log("User disconnected");
    socket.leave(payload.id);
  });
};
