'use strict'

const express = require('express')
 
const { asyncHandler } = require('../../helper/asyncHandler')
const inventoryController = require('../../controllers/inventory.controller')
 
const router = express.Router()

router.post('/amount', asyncHandler(inventoryController.addStockToInventory))
 

module.exports = router