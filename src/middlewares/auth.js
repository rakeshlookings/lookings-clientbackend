const { ROLES, MESSAGES } = require('../utils/constants.json')
const CustomError = require('../utils/customError')
const Token = require('../models/token')

module.exports.adminAuthenticator = async (req, res, next) => {
  try {
    const jwt = req.headers?.authorization
    let user = await validateTokenAndUser(jwt)
    user = user.toJSON()
    if (!isAdmin(user)) {
      throw new CustomError(MESSAGES.ACCESS_DENIED, MESSAGES.FORBIDDEN, 403)
    } else {
      req.user = user
      return next()
    }
  } catch (err) {
    return res.status(err?.code || 401).json({
      errors: err.message,
      message: err.name,
      status: err?.code || 401
    })
  }
}

module.exports.tenantAuthenticator = async (req, res, next) => {
  try {
    const jwt = req.headers?.authorization
    const user = await validateTokenAndUser(jwt)
    req.user = user.toJSON()
    return next()
  } catch (err) {
    return res.status(err?.code || 401).json({
      errors: err.message,
      message: err.name,
      status: err?.code || 401
    })
  }
}

const isAdmin = (user) => {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(user.role)
}

const validateTokenAndUser = async (token) => {
  try {
    const tokenData = await Token.findOne({ _id: token, active: true }).populate('user')
    if (tokenData?.user) {
      return tokenData.user
    } else {
      throw new CustomError(tokenData, MESSAGES.UNAUTHORIZED, 401)
    }
  } catch (error) {
    throw new CustomError(error.message, MESSAGES.UNAUTHORIZED, 401)
  }
}
