"use strict";

class ConservationManager {
  addToRooms(socket, user) {}

  leaveRooms(socket, user) {
    if (this.userConservation.has(user.conservationId)) {
      this.userConservation.get(user.conservationId).push(user);
    } else {
      this.userConservation.set(user.conservationId, [user]);
    }
  }
}

const conservationManager = new ConservationManager();

module.exports = conservationManager;
