"use strict";

require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const express = require("express");
const errorController = require("./controller/error.controller");
const appRouter = require("./routes/RESTApi/index");
const { NotFoundError } = require("./core/error.response");
const cors = require("cors");
const path = require("path");

const app = express();

// init middlewares
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// db connection here
require("./db/init.mysql.js").connect({ log: false });

// init firebase app
require("./firebase/index.js");

// app routes initialization here
app.use("/", appRouter);

// error handlers here
app.all("*", (req, res, next) => {
  const err = new NotFoundError(
    `Can't found ${req.originalUrl} on this server`
  );
  next(err);
});

app.use(errorController);

module.exports = app;
