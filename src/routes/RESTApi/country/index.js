"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const CountryController = require("../../../controller/country.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.get("/countries", asyncHandler(CountryController.getAllCountries));
router.get("/countries/:id", asyncHandler(CountryController.getCountry));

router.use("/countries", authentication);

router.post("/countries", asyncHandler(CountryController.addNewCountry));
router.delete(
  "/countries/:countryID",
  asyncHandler(CountryController.delCountry)
);

module.exports = router;
