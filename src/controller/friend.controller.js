"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const FriendService = require("../services/friend.service");

class FriendController {
  //{userId: userId from header, friendId: userId want unfriend from req.params}
  static unFriend = async (req, res, next) => {
    new SuccessResponse({
      message: "Unfriend success",
      metadata: await FriendService.unFriend({
        userId: req.user.userId,
        friendId: req.params.friendId,
      }),
    }).send(res);
  };

  //{userId: userId from header, friendId: userId want unfriend from req.body}
  static blockFriend = async (req, res, next) => {
    new SuccessResponse({
      message: "Block friend success",
      metadata: await FriendService.blockFriend({
        userId: req.user.userId,
        friendId: req.body.friendId,
      }),
    }).send(res);
  };

  //{userId: userId from header, friendId: userId want unfriend from req.body}
  static unBlockFriend = async (req, res, next) => {
    new SuccessResponse({
      message: "Block friend success",
      metadata: await FriendService.unBlockFriend({
        userId: req.user.userId,
        friendId: req.body.friendId,
      }),
    }).send(res);
  };
}

module.exports = FriendController;
