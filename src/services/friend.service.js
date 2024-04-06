"use strict";

const { Op } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const db = require("../db/init.mysql");

class FriendService {
  static createFriend = async ({ senderId, receiverId }) => {
    const newFriend = await db.Friend.create({
      sender_id: senderId,
      receiver_id: receiverId,
    });
  };

  // hủy kết bạn, block và unblock
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

  static blockFriend = async ({ userId, friendId }) => {
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

    foundFriend.is_block = true;
    if (foundFriend.sender_id == userId) {
      foundFriend.block_by = userId;
    } else {
      foundFriend.block_by = friendId;
    }
    await foundFriend.save();

    return null;
  };

  static unBlockFriend = async ({ userId, friendId }) => {
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

    if (!foundFriend.is_block) {
      throw new BadRequestError("Your friend is not block");
    } else {
      if (foundFriend.block_by == userId) {
        foundFriend.is_block = false;
        foundFriend.block_by = null;
      } else {
        throw new BadRequestError("You are not blocker");
      }
    }
    await foundFriend.save();

    return null;
  };
}

module.exports = FriendService;
