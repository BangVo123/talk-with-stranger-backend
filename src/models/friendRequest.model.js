"use strict";

const { all } = require("../app");

const TABLE_NAME = "friend_request";

module.exports = (sequelize, { DataTypes }) => {
  const friendRequest = sequelize.define(
    "FriendRequest",
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
      greeting_text: {
        type: DataTypes.STRING,
        defaultValue: "Hello, want to make friend?",
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return friendRequest;
};
