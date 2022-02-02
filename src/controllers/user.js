const userService = require('../services/user')
const { successResponseHandler, errorHandler } = require('../utils/responseHandler')
const { validationResult } = require('express-validator')
const CustomError = require('../utils/customError')
const { MESSAGES } = require('../utils/constants.json')

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('LoginValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    const response = await userService.login(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('UpdateUserValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    const response = await userService.updateUser(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const requestOtp = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('ReqOptValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    await userService.requestOtp(req)
    res.status(200).json(successResponseHandler({}))
  } catch (err) {
    req.logger.error('ReqOptValidationError', err.message)
    errorHandler(err, req, res)
  }
}

const bankIdAuth = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('BankIdAuthValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    const response = await userService.bankIdAuth(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const bankIdCollect = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('BankIdCollectValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    const response = await userService.bankIdCollect(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const checkRegistration = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.logger.error('RegistrationValidationError', errors)
      throw new CustomError(MESSAGES.BADLY_FORMED_REQUEST, MESSAGES.BAD_REQUEST)
    }
    const response = await userService.checkRegistration(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const getNeighbours = async (req, res) => {
  try {
    const response = await userService.listNeighbours(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

const logout = async (req, res) => {
  try {
    const response = await userService.logout(req)
    res.status(200).json(successResponseHandler(response))
  } catch (err) {
    errorHandler(err, req, res)
  }
}

module.exports = {
  login,
  updateUser,
  requestOtp,
  bankIdAuth,
  bankIdCollect,
  checkRegistration,
  getNeighbours,
  logout
}
