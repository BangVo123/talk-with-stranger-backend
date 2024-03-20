"use strict";

const express = require("express");

const router = express.Router();
const AccessController = require("../../../controller/access.controller");
const authentication = require("../../../middlewares/authentication");
const asyncHandler = require("../../../helpers/asyncHandler");

router.post("/users/signup", asyncHandler(AccessController.signup));
router.post("/users/signin", asyncHandler(AccessController.signin));

router.use("/users", authentication);

router.post("/users/signout", asyncHandler(AccessController.signOut));
router.post(
  "/users/refreshToken",
  asyncHandler(AccessController.refreshTheToken)
);

module.exports = router;
