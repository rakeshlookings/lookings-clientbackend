const { MESSAGES } = require('../utils/constants.json')
const CustomError = require('../utils/customError')
const BankId = require('bankid')
const client = new BankId.BankIdClient({
  pfx: './src/config/FPTestcert3_20200618.p12',
  ca: './src/config/BankID.cer',
  passphrase: 'qwerty123',
  production: false // use test environment
})

const auth = async (req) => {
  const clientIP = (req?.headers && req.headers['x-forwarded-for']) || req.connection?.remoteAddress
  req.logger.info('ClientIP', { clientIP })
  req.logger.info('Forwarded For', req?.headers && req.headers['x-forwarded-for'])
  const personalNumber = req.body?.personalNumber || '199210101953'
  const authResponse = await client.authenticate({
    personalNumber,
    endUserIp: clientIP || '127.0.0.1'
  }).catch(err => {
    throw new CustomError(err?.details || err?.code, MESSAGES.BAD_REQUEST, 4000)
  })
  req.logger.info('AuthRes from bankId', authResponse)
  if (authResponse?.orderRef) {
    return authResponse
  } else {
    throw new CustomError(authResponse?.details || authResponse?.code, MESSAGES.BAD_REQUEST)
  }
}

const collect = async (req) => {
  return client.collect({
    orderRef: req.body.orderRef
  }).catch(err => {
    throw new CustomError(err?.details || err?.code, MESSAGES.BAD_REQUEST, 400)
  })
}

module.exports = {
  auth,
  collect
}
