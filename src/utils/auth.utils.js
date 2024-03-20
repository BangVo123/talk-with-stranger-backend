"use strict";

const jwt = require("jsonwebtoken");

const createTokensPair = async (payload, privateKey, publicKey) => {
  const accessToken = await jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = await jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  jwt.verify(accessToken, publicKey, (err, decode) => {
    if (err) throw err;
    console.log("Verified access token successfully::", decode);
  });

  return { accessToken, refreshToken };
};

module.exports = {
  createTokensPair,
};
