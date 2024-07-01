'use strict'

const express = require('express')
 
const { asyncHandler } = require('../../helper/asyncHandler')
const commentController = require('../../controllers/comment.controller')
 
const router = express.Router()

router.post('', asyncHandler(commentController.createComment))
router.delete('', asyncHandler(commentController.deleteComment))
router.get('/list', asyncHandler(commentController.getComments))

module.exports = router