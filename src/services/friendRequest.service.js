"use strict";

const { Op } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require("../core/error.response");
const db = require("../db/init.mysql");

/**
 * send friend request
 * accept friend request
 * reject friend request
 * cancel friend request
 */
class FriendRequestService {
  //sender_action
  static addFriend = async ({ senderId, receiverId, body }) => {
    const foundFriendRequest = await db.FriendRequest.findOne({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
      },
    });

    if (foundFriendRequest) return null;

    const foundReceiver = await db.User.findOne({
      where: {
        id: receiverId,
      },
    });

    if (!foundReceiver) throw new BadRequestError("Can not find receiver");

    if (foundReceiver.id === senderId)
      throw new BadRequestError(
        "You can not send a friend request to yourself"
      );

    const newFriendRequest = await db.FriendRequest.create({
      receiver_id: receiverId,
      sender_id: senderId,
      greeting_text: body.greetingText || "Hello, want to make friend ?",
    });

    if (!newFriendRequest)
      throw new InternalServerError("Something went wrong");

    return null;
  };

  static cancelFriendRequest = async ({ userId, friendRequestId }) => {
    const foundFriendRequest = await db.FriendRequest.findOne({
      where: {
        id: friendRequestId,
      },
    });

    if (!foundFriendRequest)
      throw new BadRequestError("Not found friend request");

    if (foundFriendRequest.sender_id != userId)
      throw new ForbiddenError("You not allow do it");

    await foundFriendRequest.destroy();

    return null;
  };

  //receiver_action
  static acceptFriendRequest = async ({ userId, friendRequestId }) => {
    const foundFriendRequest = await db.FriendRequest.findOne({
      where: {
        id: friendRequestId,
      },
    });

    if (!foundFriendRequest)
      throw new BadRequestError("Friend request not found");

    if (foundFriendRequest.receiver_id != userId)
      throw new ForbiddenError("You not allow do it");

    await foundFriendRequest.destroy();

    const newFriend = await FriendService.createFriend({
      senderId: foundFriendRequest.serder_id,
      receiverId: userId,
    });

    if (!newFriend) throw new InternalServerError("Something went wrong");

    return null;
  };

  static rejectFriendRequest = async ({ userId, friendRequestId }) => {
    const foundFriendRequest = await db.FriendRequest.findOne({
      id: friendRequestId,
    });

    if (!foundFriendRequest)
      throw new BadRequestError("Friend request not found");

    if (foundFriendRequest.receiver_id != userId)
      ForbiddenError("You not allow do it");

    await foundFriendRequest.destroy();

    return null;
  };

  //get pending friend request
  static getPendingFriendRequest = async ({ userId, query }) => {
    const pageNum = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const resultPendingFriendRequest = await db.FriendRequest.findAndCountAll({
      where: {
        [Op.and]: [{ receiver_id: userId }],
      },
      offset: (pageNum - 1) * limit,
      limit,
    });

    return {
      data: resultPendingFriendRequest.rows,
      totalPage: Math.ceil(resultPendingFriendRequest.count / limit),
    };
  };
}

module.exports = FriendRequestService;
