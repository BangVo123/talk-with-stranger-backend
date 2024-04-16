"use strict";

const express = require("express");

const router = express.Router();

// app routes definitions here
router.use("/api/v1", require("./access"));
router.use("/api/v1", require("./country"));
router.use("/api/v1", require("./user"));
router.use("/api/v1", require("./friendRequest"));
router.use("/api/v1", require("./friend"));
router.use("/api/v1", require("./conservation"));
router.use("/api/v1", require("./message"));
router.use("/api/v1", require("./call"));

module.exports = router;
