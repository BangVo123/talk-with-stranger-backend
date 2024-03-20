"use strict";

const { Op } = require("sequelize");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const db = require("../db/init.mysql");

class CountryService {
  static getCountry = async (countryID) => {
    if (!countryID) throw new BadRequestError("Invalid countryID");
    const foundCountry = await db.Country.findOne({
      where: {
        id: countryID,
      },
    });
    if (!foundCountry) throw new NotFoundError(`Can not be found country`);
    return foundCountry;
  };

  static getAllCountries = async () => {
    const allCountry = await db.Country.findAll();
    return allCountry;
  };

  static addNewCountry = async ({
    countryName,
    countryCode,
    countryIsoCode,
  }) => {
    if (!countryName || !countryCode || !countryIsoCode)
      throw new BadRequestError("Invalid country");
    //Check exists
    console.log({ countryCode, countryIsoCode, countryName });
    const foundCountry = await db.Country.findOne({
      where: {
        [Op.or]: [
          { country_code: countryCode },
          { country_iso_code: countryIsoCode },
          { country_name: countryName },
        ],
      },
    });
    if (foundCountry) throw new BadRequestError("Country is exists");
    console.log({ countryCode, countryIsoCode, countryName });
    //Add new country
    try {
      const newCountry = await db.Country.create({
        country_name: countryName,
        country_code: countryCode,
        country_iso_code: countryIsoCode,
      });

      return newCountry;
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  };

  static deleteCountry = async (countryID) => {
    if (!countryID) throw new BadRequestError("Not provide countryID");

    const foundCountry = await db.Country.findOne({
      where: {
        id: countryID,
      },
    });

    if (!foundCountry) throw new BadRequestError("Not found");

    await foundCountry.destroy();

    return null;
  };
}

module.exports = CountryService;
