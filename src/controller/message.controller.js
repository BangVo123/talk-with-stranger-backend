"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const MessageService = require("../services/message.service");

class MessageController {
  static sendMessage = async (req, res, next) => {
    new SuccessResponse({
      message: "create message successfully",
      metadata: await MessageService.createMessage({
        senderId: req.user.userId,
        conservationId: req.params.conservationId,
        body: req.body,
      }),
    }).send(res);
  };

  static getMessages = async (req, res, next) => {
    new SuccessResponse({
      message: "create message successfully",
      metadata: await MessageService.getMessages({
        conservationId: req.params.conservationId,
        query: req.query,
      }),
    }).send(res);
  };
}

module.exports = MessageController;
