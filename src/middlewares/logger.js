const { Logger } = require('../utils/logger')
const { v4 } = require('uuid')

module.exports.log = async (req, res, next) => {
  req.correlationId = v4()
  req.logger = new Logger(req)
  return next()
}
