const winston = require('winston')
const { v4 } = require('uuid')

const option = {
  file: {
    level: process.env.LOG_LEVEL || 'info',
    filename: 'logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 10,
    colorize: true
  },
  console: {
    level: process.env.LOG_LEVEL || 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    timestamp: true
  }
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(option.file),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console(option.console)
  ],
  exitOnError: false
})

logger.stream = {
  write: (message) => {
    logger.info(message)
  }
}

class Logger {
  constructor (req) {
    this.correlationId = req.correlationId
  }

  debug (message, obj = {}) {
    logger.debug(message, { correlationId: this.correlationId, ...obj })
  }

  info (message, obj = {}) {
    logger.info(message, { correlationId: this.correlationId, ...obj })
  }

  error (msg, err) {
    // logger.error('Error log', obj)
    // console.log('Typesss', { msg: typeof message, obje: typeof obj, message, obj })
    logger.error(msg, Object.assign(err, { correlationId: this.correlationId }))
  }
}

module.exports = {
  Logger,
  logger
}
