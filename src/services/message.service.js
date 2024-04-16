"use strict";

const { where, QueryTypes } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require("../core/error.response");
const db = require("../db/init.mysql");
const { removeKeys } = require("../utils");

class MessageService {
  static createMessage = async ({ senderId, conservationId, body }) => {
    const foundSender = await db.User.findOne({
      where: {
        id: senderId,
      },
    });

    if (!foundSender) throw new BadRequestError("You are not registered");

    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");

    const newMessage = await db.Message.create({
      sender: senderId,
      conservation: conservationId,
      type: body.type,
      text: body.text,
    });

    if (!newMessage)
      throw new InternalServerError(
        "Something went wrong while sending message, please try again later!"
      );

    const newCreatedMessage = {
      ...newMessage.toJSON(),
      sender: removeKeys(foundSender.toJSON(), [
        "user_password",
        "isDeleted",
        "createdAt",
        "updatedAt",
        "user_status",
      ]),
    };

    global._io
      .to(conservationId)
      .emit("conservation/newMessage", newCreatedMessage);

    return newCreatedMessage;
  };

  static getMessages = async ({ conservationId, query }) => {
    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const { count, rows } = await db.Message.findAndCountAll({
      where: {
        conservation: conservationId,
      },
      offset: (page - 1) * limit,
      limit: limit,
      order: [["created_at", "ASC"]],
    });

    const populatedData = await Promise.all(
      rows.map(async (mess) => {
        const foundSender = await db.User.findOne({
          where: {
            id: mess.sender,
          },
        });

        return {
          ...mess.toJSON(),
          sender: removeKeys(foundSender.toJSON(), [
            "user_password",
            "isDeleted",
            "createdAt",
            "updatedAt",
            "user_status",
          ]),
        };
      })
    );

    return {
      data: populatedData,
      totalPage: Math.ceil(count / limit) || 0,
    };
  };
}

module.exports = MessageService;
