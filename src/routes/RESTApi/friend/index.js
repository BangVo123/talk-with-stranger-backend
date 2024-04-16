"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const FriendController = require("../../../controller/friend.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use(authentication);

router.delete("/friend/:friendId", asyncHandler(FriendController.unFriend));

router.patch("/blockFriend", asyncHandler(FriendController.blockFriend));

router.patch("/unBlockFriend", asyncHandler(FriendController.unBlockFriend));

module.exports = router;
