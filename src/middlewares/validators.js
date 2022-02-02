const { check, oneOf } = require('express-validator')
const { ROLES } = require('../utils//constants.json')

module.exports.loginValidator = [
  oneOf([check('bankId').exists(), check('phone').exists()]),
  check('phone').if(check('otp').exists().isLength({ min: 5 }))
]

module.exports.requestOtpValidator = [
  check('phone').exists(),
  check('countryCode').exists()
]

module.exports.createGroupValidator = [
  check('name').exists().isLength({ min: 2 })
]

module.exports.updateUserValidator = [
  check('firstName').if(check('firstName').isLength({ min: 3 })),
  check('lastName').if(check('lastName').isLength({ min: 3 })),
  check('phone').if(check('phone').isLength({ min: 8 })),
  check('address').if(check('address').isLength({ min: 5 })),
  check('countryCode').if(check('phone').notEmpty()).not().isEmpty(),
  check('phone').if(check('countryCode').notEmpty()).not().isEmpty(),
  check('role').if(check('role').isIn(...Object.values(ROLES)))
]

module.exports.nameValidator = [
  check('name').notEmpty()
]

module.exports.collectValidator = [
  check('orderRef').exists(),
  check('personalNumber').exists()
]

module.exports.registrationValidator = [
  check('phone').exists(),
  check('countryCode').exists(),
  check('personalNumber').exists()
]
