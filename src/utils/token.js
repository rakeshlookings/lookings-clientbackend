const CustomError = require('./customError')
const { MESSAGES } = require('./constants.json')
const Token = require('../models/token')

// module.exports.generateToken = (user) => {
//   const payload = {
//     iss: 'lookings',
//     sub: user._id,
//     iat: moment().unix(),
//     exp: moment().add(30, 'days').unix()
//   }
//   console.log('Token here', { id: user._id, env: process.env.TOKEN_SECRET })
//   return jwt.sign(payload, process.env.TOKEN_SECRET)
// }

module.exports.verifyToken = async (token) => {
  // let payload
  try {
    const tokenData = await Token.findOne({ _id: token }).populate('user')
    if (tokenData) {
      return tokenData.user
    } else {
      throw new CustomError(MESSAGES.INVALID_TOKEN, MESSAGES.UNAUTHORIZED, 401)
    }
    // payload = jwt.verify(token, process.env.TOKEN_SECRET)
  } catch (error) {
    throw new CustomError(MESSAGES.INVALID_TOKEN, MESSAGES.UNAUTHORIZED, 401)
  }
}

module.exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000)
}
