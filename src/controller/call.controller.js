"use strict";

const { SuccessResponse } = require("../core/success.response");
const CallService = require("../services/call.service");

class CallController {
  static newCall = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new call success",
      metadata: await CallService.createCall({
        conservationId: req.body.conseravtionId,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        caller: req.body.caller,
      }),
    }).send(res);
  };

  static getCalls = async (req, res, next) => {
    new SuccessResponse({
      message: "get calls success",
      metadata: await CallService.getCalls({
        conservationId: req.params.conservationId,
        query: req.query,
      }),
    }).send(res);
  };
}

module.exports = CallController;
