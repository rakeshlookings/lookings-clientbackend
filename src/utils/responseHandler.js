const { MESSAGES } = require('./constants.json')
const CustomError = require('./customError')

module.exports.successResponseHandler = (response, message = MESSAGES.SUCCESS, status = 200) => ({ status, data: response, message })

module.exports.errorResponseHandler = (message, res, status = 400) => {
  res.status(status).json({ message, status })
}

module.exports.errorHandler = (err, req, res) => {
  req.logger.error('Error in response handler', err)
  let status = 500
  if (err.message.includes('ValidationError')) {
    err.code = 400
    err.name = MESSAGES.BAD_REQUEST
  } else if (err.message.includes('duplicate key error')) {
    err = new CustomError(MESSAGES.DUPLICATE_RECORD, MESSAGES.BAD_REQUEST)
  }
  if (!err.code && !err.status) {
    switch (err.name) {
      case MESSAGES.BAD_REQUEST : status = 400
        break
      case MESSAGES.UNAUTHORIZED : status = 401
        break
      case MESSAGES.FORBIDDEN : status = 403
    }
  } else if (err.code > 200 && err.code < 550) {
    status = err.code
  }
  let message = MESSAGES.INTERNAL_SERVER_ERROR
  let error = MESSAGES.DEFAULT_ERROR
  if ([MESSAGES.BAD_REQUEST, MESSAGES.UNAUTHORIZED, MESSAGES.FORBIDDEN].includes(err.name)) {
    message = err.name
    error = err.message
  }
  return res.status(status).json({
    error,
    message,
    status
  })
}
