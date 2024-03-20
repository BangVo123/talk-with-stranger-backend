"use strict";

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../core/error.response");
const db = require("../db/init.mysql");

class ConservationService {
  static createConservation = async ({ userId, body }) => {
    const memberIds = body.members;

    const userFound = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!userFound) throw new BadRequestError("You are not registered");

    const remainingMembersExceptUser = memberIds.filter(
      (mid) => mid !== userId
    );

    const pendingCheck = remainingMembersExceptUser.map(async (mid) => {
      const foundAnother = await db.User.findOne({
        where: {
          id: mid,
        },
      });

      return foundAnother;
    });

    const membersValid = await Promise.all(pendingCheck);

    if (!membersValid.every((con) => !!con)) {
      throw new BadRequestError("Invalid members");
    }

    const insertedConservation = await db.Conservation.create({
      creator: userFound.id,
    });

    const insertDataSet = membersValid.map((m) => ({
      user_id: m,
      conservation: insertedConservation.id,
    }));

    await db.User.bulkCreate(insertDataSet);

    return insertedConservation;
  };
}

module.exports = ConservationService;
