"use strict";

const { InsufficientStorageError } = require("../core/error.response");
const { removeKeys } = require("../utils");

class OnlineUserManager {
  MAX_QUEUE_SIZE = 2;

  userConnections = [];
  pairingQueue = [];

  addConnection(connection) {
    this.userConnections.push(connection);
  }

  removeConnection(userId) {
    this.userConnections.splice(
      this.userConnections.indexOf((c) => c.id === userId),
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

    if (this.pairingQueue.length >= this.MAX_QUEUE_SIZE) {
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
  }
}

const onlineUserManager = new OnlineUserManager();

module.exports = onlineUserManager;
