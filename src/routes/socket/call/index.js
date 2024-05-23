"use strict";

module.exports = (socket) => {
  socket.on("call/create", ({ caller, receiver }) => {
    global._io.to(receiver.id).emit("call/received", caller);
    global._io.to(caller.id).emit("call/waiting", receiver);
  });

  socket.on("call/accept", ({ callerId, receiver }) => {
    global._io.to(callerId).emit("call/accepted", receiver);
  });

  socket.on("call/reject", ({ callerId, receiver }) => {
    global._io.to(callerId).emit("call/rejected", receiver);
  });

  socket.on("call/cancel", (id) => {
    console.log(`call cancel: ${id}`);
    global._io.to(id).emit("call/canceled");
  });

  socket.on("call/end", (id) => {
    console.log(`call end: ${id}`);
    global._io.to(id).emit("call/ended");
  });
};
