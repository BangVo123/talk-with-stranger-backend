"use strict";

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
    }
  );

  return member;
};
