'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helper/asyncHandler')
 
const router = express.Router()

router.post('', asyncHandler(productController.createNewProduct))

module.exports = router