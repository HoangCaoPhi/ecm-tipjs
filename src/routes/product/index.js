'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helper/asyncHandler')
 
const router = express.Router()

router.post('', asyncHandler(productController.createNewProduct))
router.post('/publish/:id', asyncHandler(productController.publishProduct))
router.post('/unpublish/:id', asyncHandler(productController.publishProduct))

router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publish/all', asyncHandler(productController.getAllProductPublish))

router.get('/search/:keySearch', asyncHandler(productController.searchProduct))

module.exports = router