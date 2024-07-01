'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helper/asyncHandler')
 
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(discountController.getAllProductWithDiscount))

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountByShop))
 

module.exports = router