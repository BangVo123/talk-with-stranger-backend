"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const FriendRequestService = require("../services/friendRequest.service");

class FriendRequestController {
  //{senderId: userId from header, receiverId: id of receiver from url params, body: data from req.body for more custom}
  static sendFriendRequest = async (req, res, next) => {
    new SuccessResponse({
      message: "Send friend request success",
      metadata: await FriendRequestService.addFriend({
        senderId: req.user.userId,
        receiverId: req.params.receiverId,
        body: req.body,
      }),
    }).send(res);
  };

  //{userId: userId from header, friendRequestId: id of FriendRequest from params.body}
  static cancelFriendRequest = async (req, res, next) => {
    new SuccessResponse({
      message: "Cancel friend request success",
      metadata: await FriendRequestService.cancelFriendRequest({
        userId: req.user.userId,
        friendRequestId: req.params.friendRequestId,
      }),
    }).send(res);
  };

  //{userId: userId from header, friendRequestId: id of FriendRequest from req.body}
  static acceptFriendRequest = async (req, res, next) => {
    new SuccessResponse({
      message: "Accept friend request success",
      metadata: await FriendRequestService.acceptFriendRequest({
        userId: req.user.userId,
        friendRequestId: req.params.friendRequestId,
      }),
    }).send(res);
  };

  //{userId: userId from header, friendRequestId: id of FriendRequest from req.body}
  static rejectFriendRequest = async (req, res, next) => {
    new SuccessResponse({
      message: "Reject friend request success",
      metadata: await FriendRequestService.rejectFriendRequest({
        userId: req.user.userId,
        friendRequestId: req.params.friendRequestId,
      }),
    }).send(res);
  };

  //userId: userId from header
  static getPendingFriendRequest = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all pending friend request success",
      metadata: await FriendRequestService.getPendingFriendRequest(
        req.user.userId
      ),
    }).send(res);
  };
}

module.exports = FriendRequestController;
