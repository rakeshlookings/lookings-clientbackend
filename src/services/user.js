const User = require('../models/user')
const Apartments = require('../models/apartment')
const { USER_STATUS, MESSAGES } = require('../utils/constants.json')
const CustomError = require('../utils/customError')
const { generateToken, generateOtp } = require('../utils/token')
const { sendOTP } = require('./twilio')
const moment = require('moment')
const bankId = require('./bankId')
const { ObjectId } = require('mongodb')
const Token = require('../models/token')

/**
 * Function to send and assign OTP to a user
 * @param {Object} param0 request object
 * @returns
 */
const requestOtp = async ({ body, logger }) => {
  const user = await User.findOne({
    $or: [
      {
        fullPhoneNumber: body.countryCode + body.phone
      },
      {
        phone: body.phone
      }
    ]
  })
  if (!user) {
    throw new CustomError(MESSAGES.INVALID_PHONE, MESSAGES.BAD_REQUEST)
  }
  if (user.status !== USER_STATUS.ACTIVE) {
    throw new CustomError(MESSAGES.INVALID_USER, MESSAGES.BAD_REQUEST)
  }
  const otp = generateOtp()
  const otpExpiry = moment().add(10, 'm').unix()
  logger.info('OTP generated for user ', user._id, { otp, otpExpiry })
  await User.findOneAndUpdate({
    _id: user._id
  }, {
    otp,
    otpTtl: otpExpiry
  })
  await sendOTP({ to: user.fullPhoneNumber, otp, logger })
  return true
}

const updateUser = async ({ path, body, params, logger }) => {
  const { userId } = params
  if (!Object.keys(body)?.length) {
    logger.error('Empty request for user update', { userId, body })
    throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
  }
  const user = await User.findOne({ _id: userId })
  if (!user) {
    logger.error('Invalid user id', userId)
    throw new CustomError(MESSAGES.INVALID_USER, MESSAGES.BAD_REQUEST)
  }
  const payload = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    countryCode: body.countryCode,
    address: body.address
  }
  const updateResponse = await User.findOneAndUpdate({
    _id: userId
  }, payload, { new: true }).catch(err => {
    logger.error('Err while updating the user', { body, userId, err })
    throw new CustomError(err)
  })
  return updateResponse
}

/**
 * Function to validate login credentials and return JWT token
 * @param {Object} Req // Request Object
 * @returns {Promise} User object with JWT token
 */
const login = async ({ body, logger }) => {
  const user = await loginUsingPhone({ body, logger })
  if (user?._id) {
    const userData = user.toJSON()
    // const token = generateToken(userData)
    const result = await Token.create({
      user: ObjectId(user._id)
    })
    if (result) {
      userData.token = result._id
      return userData
    } else {
      throw new CustomError(MESSAGES.INVALID_USER, MESSAGES.BAD_REQUEST)
    }
  }
}

/**
 * Function to validate phone and OTP against user
 * @param {Object} param0 Request object
 * @returns
 */
async function loginUsingPhone ({ body, logger }) {
  const user = await User.findOne({
    $or: [
      {
        fullPhoneNumber: body.countryCode + body.phone
      },
      {
        phone: body.phone
      }
    ]
  })
  if (!user) throw new CustomError(MESSAGES.INVALID_LOGIN, MESSAGES.UNAUTHORIZED)
  if (user.otpTtl <= moment().unix()) {
    throw new CustomError(MESSAGES.OTP_EXPIRED, MESSAGES.UNAUTHORIZED)
  } else if (parseInt(user.otp) === parseInt(body.otp)) {
    await User.updateOne({ _id: user._id }, { otp: null, otpTtl: null })
    return user
  } else {
    throw new CustomError(MESSAGES.INVALID_LOGIN, MESSAGES.UNAUTHORIZED)
  }
}

async function checkRegistration ({ body, logger }) {
  const user = await User.findOne({
    fullPhoneNumber: body.countryCode + body.phone,
    personalNumber: body.personalNumber
  })
  const userData = user.toJSON()
  delete userData.bankId
  return userData
}

const bankIdAuth = async (req) => {
  return bankId.auth(req)
}

const bankIdCollect = async (req) => {
  const response = await bankId.collect(req)
  req.logger.info('Collect response', response)
  if (response.status === 'complete') {
    const user = User.findOne({
      personalNumber: req.body.personalNumber
    })
    if (!user) throw new CustomError(MESSAGES.INVALID_USER, MESSAGES.UNAUTHORIZED)
    const userData = user.toJSON()
    userData.token = generateToken(userData)
    response.user = userData
  }
  return response
}

const listNeighbours = async (req) => {
  const { page = 0, limit = 10 } = req.query
  const userId = req.user?._id
  const filters = {
    owner: ObjectId(userId)
  }
  const projections = {
    complex: 1
  }
  const apartments = await Apartments.find(filters, projections).lean().exec()

  if (apartments?.length) {
    const complexes = apartments.map(item => {
      return ObjectId(item.complex)
    })

    const userFilter = {
      complex: { $in: complexes },
      owner: { $nin: [userId] }
    }

    const userProjection = { owner: 1 }

    const userApartments = await Apartments.find(userFilter, userProjection).populate('owner').skip(page * limit).limit(limit).exec()

    const userArray = userApartments.map(item => {
      return item.owner
    })

    return userArray
  } else {
    throw new CustomError(MESSAGES.USER_DOES_NOT_POSSESS, MESSAGES.BAD_REQUEST)
  }
}

const logout = async (req) => {
  const userId = req.user?._id
  const response = await Token.deleteMany({ active: true, user: userId })
  return response
}
module.exports = {
  requestOtp,
  updateUser,
  login,
  bankIdAuth,
  bankIdCollect,
  checkRegistration,
  listNeighbours,
  logout
}
