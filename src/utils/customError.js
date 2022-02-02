const { MESSAGES } = require('./constants.json')
class CustomError extends Error {
  constructor (args, name, code) {
    super(args)
    if (!code) {
      code = (name === MESSAGES.BAD_REQUEST) ? 400 : 500
    }
    this.name = name || this.name
    this.code = code
    this.status = code
  }
}
module.exports = CustomError
