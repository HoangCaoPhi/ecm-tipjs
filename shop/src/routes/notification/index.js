'use strict'

const express = require('express')
 
const { asyncHandler } = require('../../helper/asyncHandler')
const notifcationController = require('../../controllers/notifcation.controller')
 
const router = express.Router()
 
router.get('/list', asyncHandler(notifcationController.listNotificationByUser))

module.exports = router