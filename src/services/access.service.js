"use strict";

const {
  ConflictError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const db = require("../db/init.mysql");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokensPair } = require("../utils/auth.utils");
const { pickDataInfo } = require("../utils");

class AccessService {
  static refreshTheToken = async ({ refreshToken, userInfo, keyToken }) => {
    if (!refreshToken) throw new BadRequestError("Refresh token not provided");

    const { userId, email } = userInfo;

    const refreshTokensUsed = await db.RefreshToken.findAll({
      where: {
        belongs_to: keyToken.id,
      },
    });

    if (
      refreshTokensUsed.length > 0 &&
      refreshTokensUsed.find((tk) => tk.token === refreshToken)
    ) {
      const tokenFound = await db.KeyToken.findOne({ user_id: userId });

      await tokenFound.destroy();

      throw new ForbiddenError(
        "There was a suspicious behaviour of your account please log in again"
      );
    }

    if (keyToken.refresh_token !== refreshToken)
      throw new BadRequestError("Your not logged in");

    const foundUser = await db.User.findOne({
      where: {
        user_email: email,
      },
    });

    if (!foundUser) throw new BadRequestError("You are not registered");

    const newTokenPair = await createTokensPair(
      {
        userId: foundUser.id,
        email: foundUser.user_email,
      },
      keyToken.private_key,
      keyToken.public_key
    );

    try {
      await db.sequelize.transaction(async (t) => {
        await db.RefreshToken.create(
          {
            belongs_to: keyToken.id,
            token: refreshToken,
          },
          {
            transaction: t,
          }
        );

        const needUpdateKeyToken = await db.KeyToken.findOne(
          {
            where: {
              id: keyToken.id,
            },
          },
          { transaction: t }
        );

        needUpdateKeyToken.update({ refresh_token: newTokenPair.refreshToken });

        needUpdateKeyToken.save();
      });
    } catch (err) {
      throw new BadRequestError("Something went wrong");
    }

    return {
      user: pickDataInfo(foundUser.toJSON(), [
        "id",
        "user_first_name",
        "user_last_name",
        "user_email",
        "user_avatar",
        "user_background",
        "user_description",
        "user_major",
        "user_role",
        "user_dob",
        "user_gender",
        "user_country",
      ]),
      tokens: newTokenPair,
    };
  };

  static signUp = async ({
    email,
    password,
    firstName,
    lastName,
    gender,
    dob,
    major,
  }) => {
    const foundUser = await db.User.findOne({
      where: {
        user_email: email,
      },
    });

    if (foundUser) throw new ConflictError("Email already registered");

    try {
      const result = await db.sequelize.transaction(async (t) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create(
          {
            user_email: email,
            user_password: hashedPassword,
            user_first_name: firstName,
            user_last_name: lastName,
            user_gender: gender,
            user_dob: dob,
            user_major: major,
          },
          { transaction: t }
        );

        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        const [record, created] = await db.KeyToken.findOrCreate({
          where: {
            user_id: newUser.id,
          },
          defaults: {
            user_id: newUser.id,
            private_key: privateKey,
            public_key: publicKey,
          },
          transaction: t,
        });

        const tokenPair = await createTokensPair(
          {
            userId: newUser.id,
            email: newUser.user_email,
          },
          privateKey,
          publicKey
        );

        return {
          user: pickDataInfo(newUser.toJSON(), [
            "id",
            "user_first_name",
            "user_last_name",
            "user_email",
            "user_avatar",
            "user_background",
            "user_description",
            "user_major",
            "user_role",
            "user_dob",
            "user_gender",
            "user_country",
          ]),
          tokens: tokenPair,
        };
      });

      return result;
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  };

  static login = async ({ email, password }) => {
    /**
     * 1) check email
     * 2) check password
     * 3) create tokens
     * 4) send user information and token
     */
    const foundUser = await db.User.findOne({
      where: {
        user_email: email,
      },
    });

    if (!foundUser) throw new BadRequestError("You're not registered");

    const isPasswordTrue = await bcrypt.compare(
      password,
      foundUser.user_password
    );

    if (!isPasswordTrue) throw new AuthFailureError("Authentication failed");

    try {
      const result = await db.sequelize.transaction(async (t) => {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        const tokenPair = await createTokensPair(
          {
            userId: foundUser.id,
            email: foundUser.user_email,
          },
          privateKey,
          publicKey
        );

        const [record, created] = await db.KeyToken.findOrCreate({
          where: {
            user_id: foundUser.id,
          },
          defaults: {
            user_id: foundUser.id,
            private_key: privateKey,
            public_key: publicKey,
            refresh_token: tokenPair.refreshToken,
          },
          transaction: t,
        });

        if (!created) {
          record.refresh_token = tokenPair.refreshToken;
          record.private_key = privateKey;
          record.public_key = publicKey;

          await record.save();
        }

        return {
          user: pickDataInfo(foundUser.toJSON(), [
            "id",
            "user_first_name",
            "user_last_name",
            "user_email",
            "user_avatar",
            "user_background",
            "user_description",
            "user_major",
            "user_role",
            "user_dob",
            "user_gender",
            "user_country",
          ]),
          tokens: tokenPair,
        };
      });

      return result;
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  };

  static logout = async ({ keyToken }) => {
    const model = await db.KeyToken.findOne({ id: keyToken.id });

    const deleted = await model.destroy();

    if (deleted) {
      return null;
    } else {
      throw new BadRequestError("Can't log out");
    }
  };
}

module.exports = AccessService;
