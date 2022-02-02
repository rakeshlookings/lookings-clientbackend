const { OTP_MESSAGE } = require('../utils/constants.json')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNo = process.env.TWILIO_NUMBER

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken)

const sendOTP = async ({ logger, to, otp }) => {
  console.log('Sending to ', { to, otp })
  await client.messages.create({
    to,
    from: twilioNo,
    body: OTP_MESSAGE.replace('__otp__', otp)
  })
  logger.info('OTP sent to ' + to)
  return { to, otp }
}

module.exports = {
  sendOTP
}
