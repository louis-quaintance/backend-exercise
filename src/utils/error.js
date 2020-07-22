/* eslint-disable max-classes-per-file */

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

module.exports = class ApiError extends ExtendableError {
  constructor(
    m,
    code = 'UNKNOWN',
    statusCode = 500,
    source = null,
    moreInfo = null
  ) {
    super(m);
    this.id = null;
    this.code = code.toString();
    this.statusCode = statusCode;
    this.source = source;
    this.moreInfo = moreInfo;
  }
};
