// const { loginValidator, addUserValidator, createGroupValidator, updateUserValidator, nameValidator } = require('./validators')
// const { adminAuthenticator, tenantAuthenticator } = require('./auth')
const { log } = require('./logger')
module.exports = {
  ...require('./validators'),
  ...require('./auth'),
  log
}
