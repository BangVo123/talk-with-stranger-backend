"use strict";

const TABLE_NAME = "friend";

module.exports = (sequelize, { DataTypes }) => {
  const friend = sequelize.define(
    "Friend",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      receiver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return friend;
};
