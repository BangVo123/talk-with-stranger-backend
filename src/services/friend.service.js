"use strict";

const { Op } = require("sequelize");
const { BadRequestError } = require("../core/error.response");
const db = require("../db/init.mysql");

class FriendService {
  static createFriend = async ({ senderId, receiverId }) => {
    const newFriend = await db.Friend.create({
      sender_id: senderId,
      receiver_id: receiverId,
    });

    return newFriend;
  };

  static unFriend = async ({ userId, friendId }) => {
    const foundFriend = await db.Friend.findOne({
      where: {
        sender_id: {
          [Op.or]: [userId, friendId],
        },
        receiver_id: {
          [Op.or]: [userId, friendId],
        },
      },
    });

    if (!foundFriend) throw new BadRequestError("Your friend not found");

    await foundFriend.destroy();

    return null;
  };
}

module.exports = FriendService;
