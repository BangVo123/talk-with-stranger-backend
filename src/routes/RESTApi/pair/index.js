"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const CountryController = require("../../../controller/country.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use("/countries", authentication);

// router.post("/pair", asyncHandler(CountryController.addNewCountry));

module.exports = router;
