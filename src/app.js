// read env
require('dotenv').config()

const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

//console.log(`Process:`, process.env)

// Init Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Init Databasef
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helper/checkConnect')
// checkOverload()

// Init Route
app.use('/', require('./routes/index'))

// Handle Error
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json( {
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app

