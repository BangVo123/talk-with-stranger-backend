"use strict";

const { BadRequestError, AuthFailureError } = require("../core/error.response");
const db = require("../db/init.mysql");
const asyncHandler = require("../helpers/asyncHandler");
const jwt = require("jsonwebtoken");

const headers = {
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "refresh-token",
};

const authentication = asyncHandler(async (req, res, next) => {
  const clientId = req.headers[headers.CLIENT_ID];
  if (!clientId) throw new BadRequestError("Client ID not provided");

  const keyTokenStored = await db.KeyToken.findOne({
    where: {
      user_id: clientId,
    },
  });

  if (!keyTokenStored) throw new BadRequestError("You're not logged in");

  if (req.headers[headers.REFRESH_TOKEN]) {
    const refereshToken = req.headers[headers.REFRESH_TOKEN];
    const decodedRefreshToken = jwt.verify(
      refereshToken,
      keyTokenStored.public_key
    );

    if (decodedRefreshToken.userId !== clientId)
      throw new AuthFailureError("Invalid token");

    console.log(decodedRefreshToken);

    req.keyToken = keyTokenStored;
    req.user = decodedRefreshToken;
    req.refreshToken = refereshToken;

    return next();
  }
  const accessToken = req.headers[headers.AUTHORIZATION];
  if (!accessToken) throw new BadRequestError("Access token not provided");

  const decodedAccessToken = jwt.verify(accessToken, keyTokenStored.public_key);
  if (decodedAccessToken.userId !== clientId)
    throw new AuthFailureError("Invalid token");

  req.keyToken = keyTokenStored;
  req.user = decodedAccessToken;
  return next();
});

module.exports = authentication;
