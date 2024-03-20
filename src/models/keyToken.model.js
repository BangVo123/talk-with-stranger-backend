"use strict";

const TABLE_NAME = "key_token";

module.exports = (sequelize, { DataTypes }) => {
  const KeyToken = sequelize.define(
    "KeyToken",
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
      public_key: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
      private_key: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT("medium"),
        allowNull: true,
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return KeyToken;
};
