const routers = require('./src/routes')
const mongoose = require('mongoose')
const { json, urlencoded, text } = require('body-parser')
const cors = require('cors')
const { Router } = require('express')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { log } = require('./src/middlewares')

const app = express()
const globalRouter = Router()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(log)
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true, limit: '10mb' }))
app.use(text({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

globalRouter.use('/api', routers)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', globalRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

mongoose.connect(process.env.MONGODB, {})
mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log(err, 'MongoDB Connection Error. Please make sure that MongoDB is running.')
  process.exit(1)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
