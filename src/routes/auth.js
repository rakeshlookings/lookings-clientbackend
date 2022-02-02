const { Router } = require('express')
const userController = require('../controllers/user')
const { loginValidator, requestOtpValidator, collectValidator, registrationValidator } = require('../middlewares/validators')

const router = Router()

router.post('/login', loginValidator, userController.login)
router.post('/requestOtp', requestOtpValidator, userController.requestOtp)
router.post('/bankId/start', userController.bankIdAuth)
router.post('/bankId/collect', collectValidator, userController.bankIdCollect)
router.post('/checkRegistration', registrationValidator, userController.checkRegistration)

module.exports = router
