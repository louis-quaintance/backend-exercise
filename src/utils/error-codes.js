class ErrorCodes {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return `${this.name}`;
  }
}

ErrorCodes.INTERNAL_SERVER_ERROR = new ErrorCodes('INTERNAL_SERVER_ERROR');

module.exports = ErrorCodes;
