"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign Up Successfully",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  signin = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign In Successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signOut = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign Out Successfully",
      metadata: await AccessService.logout({ keyToken: req.keyToken }),
    }).send(res);
  };

  refreshTheToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh Token Successfully",
      metadata: await AccessService.refreshTheToken({
        refreshToken: req.refreshToken,
        userInfo: req.user,
        keyToken: req.keyToken,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
