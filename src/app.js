require('dotenv').config()

const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

console.log(`Process:`, process.env)

// Init Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Init Database
require('./dbs/init.mongodb')
const {checkOverload} = require('./helper/checkConnect')
checkOverload()


// Init Route
app.use('/', require('./routes/index'))


// Handle Error

module.exports = app

