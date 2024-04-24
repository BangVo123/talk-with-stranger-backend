"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const db = require("../db/init.mysql");
const { deepCleanObj, removeKeys } = require("../utils");
const UploadService = require("./upload.service");
const path = require("path");
const CountryService = require("./country.service");
const { Op } = require("sequelize");

class UserService {
  static getUserInfo = async (userID) => {
    if (!userID) throw new BadRequestError("Invalid userID");

    const foundUser = await db.User.findOne({
      where: {
        id: userID,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    return foundUser;
  };

  static updateAvatar = async (userId, file) => {
    if (!file) throw new BadRequestError("File not found");

    const foundUser = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) throw new NotFoundError("Your not registered");

    const url = await UploadService.uploadOne({
      file,
      folderName: `user-${foundUser.id}`,
      fileName: `avatar-${Date.now()}${path.extname(file.originalname)}`,
    });

    foundUser.update({ user_avatar: url });

    await foundUser.save();

    return url;
  };

  static updateBackground = async ({ userId, file }) => {
    if (!file) throw new BadRequestError("File not found");

    const foundUser = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) throw new NotFoundError("Your not registered");

    const url = await UploadService.uploadOne({
      file,
      folderName: `user-${foundUser.id}`,
      fileName: `background-${Date.now()}${path.extname(file.originalname)}`,
    });

    foundUser.update({ user_background: url });
    console.log(foundUser.user_country);
    foundUser.save();

    return url;
  };

  static updateMe = async ({ userId, dataBody }) => {
    const foundUser = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) throw new NotFoundError("User not found");

    const cleanObj = deepCleanObj(
      removeKeys(dataBody, [
        "id",
        "user_email",
        "user_password",
        "user_avatar",
        "user_background",
        "user_role",
      ])
    );

    for (var key in cleanObj) {
      foundUser[key] = cleanObj[key];
    }

    const updatedUser = await foundUser.save();

    return updatedUser;
  };

  static blockUser = async ({ blockerId, blockedId, body }) => {
    const foundUser = await db.User.findOne({
      where: {
        id: blockedId,
      },
    });

    if (!foundUser) throw new BadRequestError("User not exists");

    const foundBlock = await db.Block.findOne({
      where: {
        blocker_id: blockerId,
        blocked_id: blockedId,
      },
    });

    if (foundBlock) throw new BadRequestError("User has been block");

    if (blockedId === blockerId)
      throw new BadRequestError("You can not block yourself");

    const obj = { type: body.type };

    if (body.type === "temporary") {
      if (!body.expired)
        throw new BadRequestError("Please provide expired date");
      else {
        if (new Date(body.expired) < new Date())
          throw new BadRequestError("Expired date not valid");
      }
      obj.expired = body.expired;
    }

    await db.Block.create({
      blocker_id: blockerId,
      blocked_id: blockedId,
      ...obj,
    });

    return null;
  };

  static getBlockList = async ({ userId, query }) => {
    const pageNum = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const blockList = await db.Block.findAndCountAll({
      where: {
        blocker_id: userId,
      },
      offset: (pageNum - 1) * limit,
      limit,
    });

    return {
      data: blockList.rows,
      totalPage: Math.ceil(blockList.count / limit),
    };
  };
}

module.exports = UserService;
