'use strict'

const express = require('express')
const { asyncHandler } = require('../../helper/asyncHandler')
const checkoutController = require('../../controllers/checkout.controller')
 
const router = express.Router()

router.post('/review', asyncHandler(checkoutController.checkoutReview))
 
module.exports = router