"use strict";

const express = require("express");

const router = express.Router();

// app routes definitions here
router.use("/api/v1", require("./access"));
router.use("/api/v1", require("./country"));
router.use("/api/v1", require("./user"));
router.use("/api/v1", require("./friendRequest"));
router.use("/api/v1", require("./friend"));

module.exports = router;
