"use strict";

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({ message, statusCode, metadata = {} }) {
    this.message = message || ReasonPhrases.OK;
    this.status = statusCode || StatusCodes.OK;
    this.metadata = metadata;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

class Created extends SuccessResponse {
  constructor({
    message = ReasonPhrases.CREATED,
    statusCode = StatusCodes.CREATED,
    metadata,
  }) {
    super({ message, statusCode, metadata });
  }
}

module.exports = {
  SuccessResponse,
  Created,
};
