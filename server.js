"use strict";

process.on("uncaughtException", (e) => {
  console.log(`Uncaught Exception::${e}`);
  console.log("Process will exit...");
  process.exit(1);
});

const app = require("./src/app");
const {
  app: { port },
} = require("./src/config/config.app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173/*",
  },
});

const serverInstance = server.listen(port, () => {
  console.log("\x1b[33m%s", "Server listening on port::" + port);
});

require("./src/socket/socket.init")(io);

global._io = io;

process.on("unhandledRejection", (e) => {
  console.log("Unhandled rejection::" + e.message);
  console.log("Server is shutting down");

  serverInstance.close(() => {
    process.exit(1);
  });
});

process.on("SIGINT", () => {
  console.log("Ctrl c deteted app is closing");

  serverInstance.close(() => {
    console.log("Server closed");
  });
});
