"use strict";

const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const db = require("../db/init.mysql");

class CallService {
  static createCall = async ({ conservationId, startAt, endAt, caller }) => {
    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");
    if (startAt > endAt) throw new BadRequestError("Time is not valid");

    const newCall = await db.Call.create({
      conservation: conservationId,
      start_at: startAt,
      end_at: endAt,
      caller,
    });

    if (!newCall) throw new InternalServerError("Something went wrong");
    return newCall;
  };

  static getCalls = async ({ conservationId, query }) => {
    const pageNum = parseInt(query.page) | 1;
    const limit = parseInt(query.limit) | 10;

    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");

    const { rows, count } = await db.Call.findAndCountAll({
      where: {
        conservation: foundConservation.id,
      },
      limit,
      offset: (pageNum - 1) * limit,
    });

    return {
      data: rows,
      totalPage: Math.ceil(count / limit),
    };
  };
}

module.exports = CallService;
