"use strict";

const { Sequelize, Model } = require("sequelize");
const {
  db: { host, port, password, user, name },
} = require("../config/config.app");
const fs = require("fs");
const path = require("path");

class DB {
  static instance = null;

  constructor() {}

  async connect({ log = true }) {
    const _this = this;

    const dbOptions = {
      host: host,
      port: port,
      dialect: "mysql",
      operatorAlias: false,
      define: {
        underscored: true,
      },
      pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: log,
    };

    const sequelize = new Sequelize(name, user, password, dbOptions);

    sequelize
      .authenticate()
      .then(() => {
        console.log("\x1b[32m%s", "Successfully connected to database");
        _this.sequelize = sequelize;
        _this.Sequelize = Sequelize;

        _this.registerModels();
      })
      .catch((err) => console.log("Error connecting to database::" + err));
  }

  registerModels() {
    const files = fs.readdirSync(path.join(__dirname, "..", "models"));
    const fileExtensionRegex = new RegExp(/\w+.model.js/);

    files
      .filter((file) => fileExtensionRegex.test(file))
      .forEach((file) => {
        const model = require(path.join(__dirname, "../models", file))(
          this.sequelize,
          this.Sequelize
        );

        this[model.name] = model;
      });

    this.sync()
      .then(() => {
        console.log(
          "\x1b[32m%s",
          "Register and synchronize models successfully"
        );
      })
      .catch((err) =>
        console.log(
          "Something wrong happened while synchronizing models::" + err
        )
      );
  }

  async sync() {
    await this.dropOldFkConstraints();
    await this.dropOldIndexes();
    await this.sequelize.sync({ alter: true });
  }

  async dropOldIndexes() {
    const rawTables = await this.sequelize.query("SHOW TABLES");

    const tables = rawTables[0].map((i) => i[Object.keys(rawTables[0][0])[0]]);

    for (const t of tables) {
      const rawKeys = await this.sequelize.query(`SHOW INDEX FROM ${t}`);
      const keys = rawKeys[0]
        .map((i) => i["Key_name"])
        .filter((i) => i.match(/[a-zA-Z]+_\d+/));

      for (const k of keys) {
        await this.sequelize.query(`ALTER TABLE ${t} DROP INDEX ${k}`);
      }
    }
  }

  async dropOldFkConstraints() {
    const rawTables = await this.sequelize.query("SHOW TABLES");

    const tables = rawTables[0].map((i) => i[Object.keys(rawTables[0][0])[0]]);

    for (const t of tables) {
      const rawKeys = await this.sequelize
        .query(`SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
      where TABLE_NAME ='${t}'`);

      const keys = rawKeys[0]
        .map((i) => i["CONSTRAINT_NAME"])
        .filter((i) => i.match(/[a-zA-Z]+_ibfk_\w*/));

      for (const k of keys) {
        await this.sequelize.query(
          `ALTER TABLE \`${t}\` DROP FOREIGN KEY ${k}`
        );
      }
    }
  }

  static getInstance() {
    if (DB.instance === null) {
      DB.instance = new DB();
    }

    return DB.instance;
  }
}

const db = DB.getInstance();

module.exports = db;
