'use strict'

const express = require('express')
const { asyncHandler } = require('../../helper/asyncHandler')
const cartController = require('../../controllers/cart.controller')
 
const router = express.Router()

router.post('', asyncHandler(cartController.addProductToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('/all', asyncHandler(cartController.list))
 

module.exports = router