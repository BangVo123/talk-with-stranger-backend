"use strict";

const TABLE_NAME = "block";

module.exports = (sequelize, { DataTypes }) => {
  const block = sequelize.define(
    "Block",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      blocker_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      blocked_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      type: {
        type: DataTypes.ENUM("temporary", "pernament"),
        allowNull: false,
      },
      expired: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return block;
};
