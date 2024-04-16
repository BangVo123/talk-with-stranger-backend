"use strict";

const OnlineUserManager = require("../../../managers/onlineUsers.manager");

module.exports = (socket) => {
  socket.on("conservation/findRandom", (payload) => {
    console.log("Start finding random users...");
    OnlineUserManager.addConnectionToPairingQueue({ ...payload, socket });
  });

  socket.on("conservation/cancelFind", (payload) => {
    OnlineUserManager.removeConnectionFromPairingQueue(payload);
  });

  socket.on("conservation/leave", async (roomId) => {
    console.log("Socket left::->socketId", socket?.id, "->roomId::", roomId);
    const roomSockets = global._io.sockets.adapter.sids.keys();

    Array.from(roomSockets).forEach((socketId) => {
      global._io.sockets.sockets.get(socketId).leave(roomId);
    });
  });

  socket.on("conservation/setup", (conservationId) => {
    console.log(`socket ${socket.id} joins ${conservationId}`);
    socket.join(conservationId);
  });

  socket.on("conservation/leaveChatRoom", async (conservationId) => {
    console.log(`socket ${socket.id} leaves ${conservationId}`);
    socket.leave(conservationId);
  });
};
