const appConfig = {
  dev: {
    app: {
      port: process.env.DEV_APP_PORT || 3052,
    },
    db: {
      host: process.env.DEV_DB_HOST || "localhost",
      port: process.env.DEV_DB_PORT || 3306,
      name: process.env.DEV_DB_NAME || "talk_with_stranger_dev",
      password: process.env.DEV_DB_PASSWORD || "",
      user: process.env.DEV_DB_USER || "",
    },
  },
  prod: {
    app: {
      port: 3053,
    },
    db: {
      host: process.env.PROD_DB_HOST || "localhost",
      port: process.env.PROD_DB_PORT || 3030,
      name: process.env.PROD_DB_NAME || "talk_with_stranger_prod",
      password: process.env.DEV_DB_PASSWORD || "",
      user: process.env.DEV_DB_USER || "",
    },
  },
};

const env = process.env.NODE_ENV || "dev";

module.exports = appConfig[env];
