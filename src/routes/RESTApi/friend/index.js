"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const FriendController = require("../../../controller/friend.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use(authentication);

router.delete("/friends/:friendId", asyncHandler(FriendController.unFriend));

router.patch(
  "/friends/blockFriend",
  asyncHandler(FriendController.blockFriend)
);

router.patch(
  "/friends/unBlockFriend",
  asyncHandler(FriendController.unBlockFriend)
);

module.exports = router;
