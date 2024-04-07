"use strict";

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
        default: "Hello, want to make friend?",
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        default: "pending",
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return friendRequest;
};
