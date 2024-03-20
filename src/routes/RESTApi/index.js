"use strict";

const express = require("express");

const router = express.Router();

// app routes definitions here
router.use("/api/v1", require("./access"));
router.use("/api/v1", require("./country"));
router.use("/api/v1", require("./user"));

module.exports = router;
