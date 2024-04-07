"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const FriendRequestController = require("../../../controller/friendRequest.controller");
const router = express.Router();

router.post(
  "/sendFriendRes:/receiverId",
  asyncHandler(FriendRequestController.sendFriendRequest)
);

router.delete(
  "/friendRes/:friendRequestBody",
  asyncHandler(FriendRequestController.cancelFriendRequest)
);

router.post(
  "/acceptFriendRes",
  asyncHandler(FriendRequestController.acceptFriendRequest)
);

router.patch(
  "/friendRes",
  asyncHandler(FriendRequestController.rejectFriendRequest)
);

router.get(
  "/FriendRes",
  asyncHandler(FriendRequestController.getPendingFriendRequest)
);

module.exports = router;
