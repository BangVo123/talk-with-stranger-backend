"use strict";

const { SuccessResponse } = require("../core/success.response");
const ConservationService = require("../services/conservation.service");

class ConservationController {
  static createConservation = async (req, res, next) => {
    new SuccessResponse({
      message: "Create conservation success",
      metadata: await ConservationService.createConservation({
        userId: req.user.userId,
        body: req.body,
      }),
    }).send(res);
  };

  static getConservation = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all conservation success",
      metadata: await ConservationService.getConservations({
        userId: req.user.userId,
        query: req.query,
      }),
    }).send(res);
  };
}

module.exports = ConservationController;
