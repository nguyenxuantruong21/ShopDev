const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const app = express()


// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// init db
require("./database/init.mongodb")
const { checkOverload } = require('./helpers/check.connect')

// checkOverload()

// init router
app.use('/', require('./routers'))

// handling error

module.exports = app
