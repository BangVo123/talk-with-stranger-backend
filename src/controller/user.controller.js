"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static getUserInfo = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user info success",
      metadata: await UserService.getUserInfo(req.user.userId),
    }).send(res);
  };

  static updateUserAvatar = async (req, res, next) => {
    new SuccessResponse({
      message: "Update user avatar success",
      metadata: await UserService.updateAvatar(req.user.userId, req.file),
    }).send(res);
  };

  static updateUserBackground = async (req, res, next) => {
    new SuccessResponse({
      message: "Update user background success",
      metadata: await UserService.updateBackground({
        userId: req.user.userId,
        file: req.file,
      }),
    }).send(res);
  };

  static updateMe = async (req, res, next) => {
    new SuccessResponse({
      message: "User update success",
      metadata: await UserService.updateMe({
        userId: req.user.userId,
        dataBody: req.body,
      }),
    }).send(res);
  };

  static blockUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Block success",
      metadata: await UserService.blockUser({
        blockerId: req.user.userId,
        blockedId: req.params.userId,
        body: req.body,
      }),
    }).send(res);
  };

  static getBlockList = async (req, res, next) => {
    new SuccessResponse({
      message: "Block success",
      metadata: await UserService.getBlockList({
        userId: req.user.userId,
        query: req.query,
      }),
    }).send(res);
  };
}

module.exports = UserController;
