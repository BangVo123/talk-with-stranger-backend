"use-strict";

const connectionRouter = require("./connection/index.js");
const conservationRouter = require("./conservation");
const messageRouter = require("./message");

module.exports = (socket) => {
  connectionRouter(socket);
  conservationRouter(socket);
  messageRouter(socket);
};
