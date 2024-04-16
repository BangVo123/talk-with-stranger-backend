"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const MessageController = require("../../../controller/message.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use(authentication);
router.post(
  "/messages/:conservationId",
  asyncHandler(MessageController.sendMessage)
);
router.get(
  "/messages/:conservationId",
  asyncHandler(MessageController.getMessages)
);

module.exports = router;
