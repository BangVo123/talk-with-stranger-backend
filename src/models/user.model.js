"use strict";

const db = require("../db/init.mysql");
const { removeKeys } = require("../utils");

const TABLE_NAME = "user";

module.exports = (sequelize, { DataTypes }) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      user_first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_status: {
        type: DataTypes.ENUM("ACTIVE", "BLOCKED"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      user_gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
        defaultValue: "male",
      },
      user_email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      user_password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_avatar: DataTypes.TEXT("tiny"),
      user_background: DataTypes.TEXT("tiny"),
      user_description: DataTypes.TEXT("tiny"),
      user_major: DataTypes.STRING(20),
      user_role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      user_dob: {
        type: DataTypes.DATE,
        validator: {
          isBefore: DataTypes.NOW,
        },
      },
      user_country: {
        type: DataTypes.UUID,
        references: {
          model: "country",
          key: "id",
        },
      },
    },
    {
      tableName: TABLE_NAME,
      indexes: [
        {
          type: "FULLTEXT",
          name: "idx_u",
          fields: ["user_first_name", "user_last_name"],
        },
      ],
      hooks: {
        afterFind: async function (model) {
          if (model?.user_country) {
            const country = await db.Country.findOne({
              where: {
                id: model.user_country,
              },
            });
            model.user_country = removeKeys(country.toJSON(), [
              "createdAt",
              "updatedAt",
            ]);
          }
        },
        afterSave: async function (model) {
          if (model?.user_country) {
            const country = await db.Country.findOne({
              where: {
                id: model.user_country,
              },
            });
            model.user_country = removeKeys(country.toJSON(), [
              "createdAt",
              "updatedAt",
            ]);
          }
        },
        beforeUpdate: async function (model) {
          if (typeof model?.user_country === "object") {
            model.user_country = model.user_country?.id;
          }
        },
      },
    }
  );

  return User;
};
