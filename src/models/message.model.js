"use strict";
const db = require("../db/init.mysql");

const TABLE_NAME = "message";

module.exports = (sequelize, { DataTypes }) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      sender: {
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
      type: {
        type: DataTypes.ENUM("text", "images", "files", "audio", "video"),
        defaultValue: "text",
      },
      text: {
        type: DataTypes.STRING(256),
      },
      attachment: {
        type: DataTypes.TEXT("tiny"),
      },
    },
    {
      tableName: TABLE_NAME,
      indexes: [
        {
          type: "FULLTEXT",
          name: "idx_m",
          fields: ["text"],
        },
      ],
      hooks: {
        afterCreate: async function (record) {
          const conservation = record.conservation;
          if (!conservation) return;

          const foundConservation = await db.Conservation.findOne({
            where: {
              id: conservation,
            },
          });

          await foundConservation.increment("message_count");
        },
        afterDestroy: async function (record) {
          const conservation = record.conservation;
          if (!conservation) return;

          const foundConservation = await db.Conservation.findOne({
            where: {
              id: conservation,
            },
          });

          await foundConservation.decrement("message_count");
        },
      },
    }
  );

  return Message;
};
