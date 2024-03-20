"use strict";

const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const CountryService = require("../services/country.service");

class CountryController {
  static getCountry = async (req, res, next) => {
    new SuccessResponse({
      message: "Found success",
      metadata: await CountryService.getCountry(req.params.id),
    }).send(res);
  };

  static getAllCountries = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all countries sucess",
      metadata: await CountryService.getAllCountries(),
    }).send(res);
  };

  static addNewCountry = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new country success",
      metadata: await CountryService.addNewCountry(req.body),
    }).send(res);
  };

  static delCountry = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete success",
      metadata: CountryService.deleteCountry(req.params.countryID),
    }).send(res);
  };
}

module.exports = CountryController;
