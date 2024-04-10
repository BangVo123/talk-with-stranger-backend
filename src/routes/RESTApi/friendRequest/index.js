"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const FriendRequestController = require("../../../controller/friendRequest.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use("/friendRequest", authentication);

router.post(
  "/friendRequest/:receiverId",
  asyncHandler(FriendRequestController.sendFriendRequest)
);

router.delete(
  "/friendRequest/:friendRequestId",
  asyncHandler(FriendRequestController.cancelFriendRequest)
);

router.patch(
  "/friendRequest/accept/:friendRequestId",
  asyncHandler(FriendRequestController.acceptFriendRequest)
);

router.patch(
  "/friendRequest/reject/:friendRequestId",
  asyncHandler(FriendRequestController.rejectFriendRequest)
);

router.get(
  "/friendRequest/pending",
  asyncHandler(FriendRequestController.getPendingFriendRequest)
);

module.exports = router;
