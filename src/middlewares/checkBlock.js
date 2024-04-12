"use strict";

const { ForbiddenError } = require("../core/error.response");
const db = require("../db/init.mysql");
const { Op } = require("sequelize");
const asyncHandler = require("../helpers/asyncHandler");

const checkBlock = (paramsName) => {
  return async (req, res, next) => {
    const foundBlock = await db.Block.findOne({
      where: {
        blocker_id: {
          [Op.or]: [req.user.userId, req.params[paramsName]],
        },
        blocked_id: {
          [Op.or]: [req.user.userId, req.params[paramsName]],
        },
      },
    });

    if (foundBlock) throw new ForbiddenError("Block!");

    return next();
  };
};

module.exports = checkBlock;
