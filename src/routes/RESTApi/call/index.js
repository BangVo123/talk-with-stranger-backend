"use strict";

const express = require("express");

const router = express.Router();
const authentication = require("../../../middlewares/authentication");
const asyncHandler = require("../../../helpers/asyncHandler");
const CallController = require("../../../controller/call.controller");

router.use("/call", authentication);

router.post("/call", asyncHandler(CallController.newCall));
router.get("/call/:conservationId", asyncHandler(CallController.getCalls));

module.exports = router;
