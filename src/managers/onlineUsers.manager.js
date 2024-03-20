"use strict";

const { InsufficientStorageError } = require("../core/error.response");
const { removeKeys } = require("../utils");

class OnlineUserManager {
  ready = "READY";
  pending = "PENDING";
  disconected = "DISCONNECTED";
  maxQueueSize = 2;

  userConnections = [];
  pairingQueue = [];

  addConnection(connection) {
    this.userConnections.push({ ...connection, readyToPair: false });
  }

  setCallState(userId, state) {
    const user = this.userConnections.find((u) => u.userId === userId);
    if (!user) return;
    user.callState = state;
  }

  removeConnection(userId) {
    this.userConnections.splice(
      this.userConnections.indexOf((c) => c.userId === userId),
      1
    );
  }

  removeFromPairingQueue(userId) {
    this.pairingQueue.splice(
      this.pairingQueue.indexOf((c) => c.userId === userId),
      1
    );
  }

  addConnectionToPairingQueue(userInfo) {
    /**
     * {
     *  userId,
     *  username,
     *  userAvatarUrl,
     *  userCountry,
     *  socket,
     *  peerId
     * }
     */
    if (this.pairingQueue.find((u) => u.userId === userInfo.userId)) return;

    this.pairingQueue.push(userInfo);

    console.log(this.pairingQueue.map((u) => u.userName));

    if (this.pairingQueue.length >= this.maxQueueSize) {
      console.log("pairing");
      const user1 = this.pairingQueue.shift();
      const user2 = this.pairingQueue.shift();
      const roomId = `room-${Date.now()}`;

      user1.socket.join(roomId);
      user2.socket.join(roomId);

      global._io.to(roomId).emit("conservation/founded", {
        caller: removeKeys(user1, ["socket"]),
        receiver: removeKeys(user2, ["socket"]),
        roomId,
      });
    } else {
      global._io.to(userInfo.socket?.id).emit("conservation/founding");
    }
    console.log(this.pairingQueue.map((u) => u.userName));
  }

  removeConnectionFromPairingQueue(userId) {
    if (userId && this.pairingQueue.find((u) => u.userId === userId)) {
      this.pairingQueue.splice(
        this.pairingQueue.indexOf((user) => user.userId === userId),
        1
      );
    }
    console.log(this.pairingQueue.map((u) => u.userName));
  }
}

const onlineUserManager = new OnlineUserManager();

module.exports = onlineUserManager;
