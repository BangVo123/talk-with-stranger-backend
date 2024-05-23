"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../../helpers/asyncHandler");
const { route } = require("../access");
const authentication = require("../../../middlewares/authentication");
const UserController = require("../../../controller/user.controller");
const { uploadMemory } = require("../../../services/multer.service");

router.use("/users", authentication);
router.get("/users/me", asyncHandler(UserController.getUserInfo));
router.patch(
  "/users/avatar",
  uploadMemory.single("avatar"),
  asyncHandler(UserController.updateUserAvatar)
);
router.patch(
  "/users/background",
  uploadMemory.single("background"),
  asyncHandler(UserController.updateUserBackground)
);
router.patch("/users/me", asyncHandler(UserController.updateMe));
router.post("/users/block/:userId", asyncHandler(UserController.blockUser));
router.post(
  "/users/conservations/:conservationId",
  asyncHandler(UserController.joinConservation)
);
router.delete(
  "/users/conservations/:conservationId",
  asyncHandler(UserController.leaveConservation)
);
router.get("/users/block", asyncHandler(UserController.getBlockList));

module.exports = router;
