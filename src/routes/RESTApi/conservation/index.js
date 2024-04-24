"use strict";

const express = require("express");
const asyncHandler = require("../../../helpers/asyncHandler");
const ConservationController = require("../../../controller/conservation.controller");
const authentication = require("../../../middlewares/authentication");
const router = express.Router();

router.use("/conservations", authentication);

router.post(
  "/conservations",
  asyncHandler(ConservationController.createConservation)
);
router.get(
  "/conservations",
  asyncHandler(ConservationController.getConservations)
);
router.get(
  "/conservations/search",
  asyncHandler(ConservationController.search)
);
router.get(
  "/conservations/:conservationId",
  asyncHandler(ConservationController.getConservation)
);

module.exports = router;
