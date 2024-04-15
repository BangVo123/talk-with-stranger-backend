"use strict";

const { Op } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  ConflictError,
} = require("../core/error.response");
const db = require("../db/init.mysql");
const { pickDataInfo, removeKeys } = require("../utils");
const ConservationService = require("./conservation.service");
const FriendService = require("./friend.service");

/**
 * send friend request
 * accept friend request
 * reject friend request
 * cancel friend request
 */
class FriendRequestService {
  //sender_action
  static addFriend = async ({ senderId, receiverId, body }) => {
    const foundFriend = await db.Friend.findOne({
      where: {
        sender_id: {
          [Op.or]: [senderId, receiverId],
        },
        receiver_id: {
          [Op.or]: [senderId, receiverId],
        },
      },
    });

    if (foundFriend) throw new ConflictError("You're already been friend");

    const foundFriendRequest = await db.FriendRequest.findOne({
      where: {
        sender_id: {
          [Op.or]: [senderId, receiverId],
        },
        receiver_id: {
          [Op.or]: [senderId, receiverId],
        },
      },
    });

    if (foundFriendRequest)
      throw new ConflictError(
        "You already have a friend request with this user"
      );

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
      senderId: foundFriendRequest.sender_id,
      receiverId: userId,
    });

    if (!newFriend) throw new InternalServerError("Something went wrong");

    const newConservation = await ConservationService.createConservation({
      userId: userId,
      body: {
        type: "one_to_one",
        members: [foundFriendRequest.sender_id],
      },
    });

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

    const resultDataPending = resultPendingFriendRequest.rows.map(
      async (friendReq) => {
        const relatedUser = await db.User.findOne({
          where: {
            id: friendReq.sender_id,
          },
        });

        return {
          ...removeKeys(friendReq.toJSON(), [
            "createdAt",
            "updatedAt",
            "sender_id",
          ]),
          sender: pickDataInfo(relatedUser.toJSON(), [
            "id",
            "user_first_name",
            "user_last_name",
            "user_email",
            "user_avatar",
            "user_background",
            "user_description",
            "user_major",
            "user_role",
            "user_dob",
            "user_gender",
            "user_country",
          ]),
        };
      }
    );

    const resultDataResolve = await Promise.all(resultDataPending);

    return {
      data: resultDataResolve,
      totalPage: Math.ceil(resultPendingFriendRequest.count / limit),
    };
  };
}

module.exports = FriendRequestService;
