"use strict";

const { where, QueryTypes } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
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

      return foundAnother.toJSON();
    });

    const membersValid = await Promise.all(pendingCheck);

    if (!membersValid.every((con) => !!con)) {
      throw new BadRequestError("Invalid members");
    }

    const insertedConservation = await db.Conservation.create({
      creator: userFound.id,
      type: body.type,
    });

    const insertDataSet = membersValid.map((m) => ({
      user_id: m.id,
      conservation: insertedConservation.id,
    }));
    console.log(insertDataSet);

    await db.Member.bulkCreate(insertDataSet);

    return insertedConservation;
  };

  static joinConservation = async ({ conservationId, userId }) => {
    const foundConservation = await db.Conservation.findOne({
      where: {
        is_deleted: false,
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");
    if (foundConservation.type === "one_to_one")
      throw new BadRequestError("Can not join a private conservation");

    await db.Member.create({
      user_id: userId,
      conservation: foundConservation.id,
    });

    return null;
  };

  static leaveConservation = async ({ conservationId, userId }) => {
    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");
    if (foundConservation.type === "one_to_one")
      throw new BadRequestError("Can not leave conservation");
    if (foundConservation.creator === userId)
      throw new ForbiddenError("Creator can not leave conservation");

    const memberCount = await db.Member.count({
      where: {
        conservation: foundConservation.id,
      },
    });

    await db.Member.destroy({
      where: {
        user_id: userId,
      },
    });

    if (memberCount == 1) {
      foundConservation.is_deleted = true;
    }
    await db.Conservation.save();

    return null;
  };

  static deleteConservation = async ({ conservationId, userId }) => {
    const foundConservation = await db.Conservation.findOne({
      where: {
        id: conservationId,
      },
    });

    if (!foundConservation) throw new BadRequestError("Conservation not found");
    if (foundConservation.type === "one_to_one")
      throw new BadRequestError("Can not delete conservation");
    if (foundConservation.creator !== userId)
      throw new ForbiddenError("You are not creator");

    foundConservation.is_deleted = true;
    await db.Conservation.save();

    return null;
  };

  static getFriendConservation = async (userId) => {
    // const conservationList = await db.Conservation.findAll({
    //   include: [
    //     {
    //       model: Member,
    //       where: (user_id = userId),
    //     },
    //   ],
    // });

    //Lấy ra list conservatoin, lặp qua mảng rồi lấy thông tin tương ứng từ conservation id

    const friendList = await db.Friend.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
    });
  };

  static getConservations = async ({ userId, query }) => {
    const pageNum = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    // const joinedConservation = await db.Conservation.findAndCountAll({
    //   attribute: ["id", "creator", "type", "message_count", "call_count"],
    //   where: {
    //     is_deleted: false,
    //   },
    //   include: [
    //     {
    //       model: Member,
    //       where: {
    //         id: userId,
    //       },
    //     },
    //   ],
    //   offset: (pageNum - 1) * limit,
    //   limit,
    // });

    const joinedConservation = await db.sequelize.query(
      "SELECT * FROM conservation c JOIN member m ON c.id = m.conservation WHERE m.user_id = :userId LIMIT :limit OFFSET :offset",
      {
        type: QueryTypes.SELECT,
        replacements: {
          userId: userId,
          limit,
          offset: (pageNum - 1) * limit,
        },
      }
    );
    return joinedConservation;
  };
}

module.exports = ConservationService;

/**
 *
 *  -- creator cũm là 1 member - sửa thêm member
 * group thì name và avt mặc định của creator, sửa thì sửa lại
 * one_to_one thì name và avt mặc định là của friend
 * -- Khả năng là sửa lại lúc accept friend request
 *
 * getAllConservation -- chia làm 2 mảng kết quả
 *
 * Lấy từ userId -> memberId -> conservationId -> type
 *
 * Xử lý 2 lọai type ra 2 mảng khác nhau, nối 2 mảng lại với nhau sau đó sort lại rồi trả cho fe
 *
 *
 */
