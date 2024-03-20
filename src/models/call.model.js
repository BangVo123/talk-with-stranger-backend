"use strict";

const TABLE_NAME = "calls";

module.exports = (sequelize, { DataTypes }) => {
  const call = sequelize.define(
    "Call",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      startedAt: {
        type: DataTypes.DATE,
        default: Date.now(),
      },
      endedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: TABLE_NAME,
      hooks: {
        afterCreate: async function (record) {
          const conservation = record.conservation;
          if (!conservation) return;

          const foundConservation = await db.Conservation.findOne({
            where: {
              id: conservation,
            },
          });

          await foundConservation.increment("call_count");
        },
        afterDestroy: async function (record) {
          const conservation = record.conservation;
          if (!conservation) return;

          const foundConservation = await db.Conservation.findOne({
            where: {
              id: conservation,
            },
          });

          await foundConservation.decrement("call_count");
        },
      },
    }
  );

  return call;
};
