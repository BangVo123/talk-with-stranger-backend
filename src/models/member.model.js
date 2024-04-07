"use strict";

const { BadRequestError, ForbiddenError } = require("../core/error.response");
const db = require("../db/init.mysql");

const TABLE_NAME = "member";

module.exports = (sequelize, { DataTypes }) => {
  const member = sequelize.define(
    "Member",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      conservation: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "conservation",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: TABLE_NAME,
      hooks: {
        beforeCreate: async function (record) {
          const foundConservation = await db.Conservation.findOne({
            where: record.conservation,
          });

          if (!foundConservation)
            throw new BadRequestError("Couldn't find a reservation");

          if (foundConservation.type === "one_to_one") {
            const currentMemsCount = await db.Member.count({
              where: {
                conservation: foundConservation.id,
              },
            });

            if (currentMemsCount === 2) {
              throw new ForbiddenError("Can't not add more than 2 members");
            }
          }
        },
      },
    }
  );

  return member;
};
