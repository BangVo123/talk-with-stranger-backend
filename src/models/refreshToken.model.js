"use strict";

const TABLE_NAME = "refresh_token";

module.exports = (sequelize, { DataTypes }) => {
  const KeyToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      belongs_to: {
        type: DataTypes.UUID,
        references: {
          model: "key_token",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return KeyToken;
};
