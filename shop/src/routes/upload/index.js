'use strict'

const express = require('express')
 
const { asyncHandler } = require('../../helper/asyncHandler')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk } = require('../../configs/multer.config')
 
const router = express.Router()


router.post('/link', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

module.exports = router