"use strict";

const TABLE_NAME = "conservation";

module.exports = (sequelize, { DataTypes }) => {
  const conservation = sequelize.define(
    "Conservation",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      creator: {
        type: DataTypes.UUID,
        references: {
          model: "user",
          key: "id",
        },
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("group", "one_to_one"),
        defaultValue: "one_to_one",
      },
      message_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      call_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return conservation;
};
