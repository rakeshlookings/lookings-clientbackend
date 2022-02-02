const { Router } = require('express')
const userController = require('../controllers/user')
const middlewares = require('../middlewares')

const router = Router()

router.put('/:userId', middlewares.tenantAuthenticator, middlewares.updateUserValidator, userController.updateUser)

router.get('/:userId/neighbours', middlewares.tenantAuthenticator, userController.getNeighbours)

router.put('/:userId/logout', middlewares.tenantAuthenticator, userController.logout)

module.exports = router
