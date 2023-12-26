const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()


// init middelware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// init database
require('./database/init.mongodb')
const { checkOverLoad } = require('./helpers/check.connect')
// checkOverLoad()
// init router
app.use('/', require('./routers/index'))

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message
  })
})

module.exports = app
