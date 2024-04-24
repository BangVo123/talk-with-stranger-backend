"use-strict";

const connectionRouter = require("./connection/index.js");
const conservationRouter = require("./conservation");
const messageRouter = require("./message");
const callRouter = require("./call");

module.exports = (socket) => {
  connectionRouter(socket);
  conservationRouter(socket);
  messageRouter(socket);
  callRouter(socket);
};
