"use strict";
const db = require("../db/init.mysql");

const TABLE_NAME = "password_reset_token";

module.exports = (sequelize, { DataTypes }) => {
  const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      expiredAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(new Date().getTime() + 10 * 60 * 1000),
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return PasswordResetToken;
};
