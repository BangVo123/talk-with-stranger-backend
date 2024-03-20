"use strict";

const TABLE_NAME = "country";

module.exports = (sequelize, { DataTypes }) => {
  const Country = sequelize.define(
    "Country",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      country_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      country_iso_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: TABLE_NAME,
    }
  );

  return Country;
};
