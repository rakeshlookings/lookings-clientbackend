const { Router } = require('express')
const AuthRouter = require('./auth')
const SystemRouter = require('./system')
const UserRouter = require('./user')

const router = Router()

router.use('/v1/auth', AuthRouter)
router.use('/v1/user', UserRouter)

router.use(SystemRouter)

module.exports = router
