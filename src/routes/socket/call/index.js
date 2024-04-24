"use strict";

module.exports = (socket) => {
  socket.on("call/create", ({ caller, receiverId }) => {
    console.log("Call create");
    global._io.to(receiverId).emit("call/received", caller);

    global._io.to(receiverId.id).emit("call/waiting");
  });

  socket.on("call/accept", (payload) => {
    global._io.to(receiverId).emit("call/accepted", caller);
  });
};
