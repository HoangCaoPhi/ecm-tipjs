'use strict'

const express = require('express')
const { apiKey, permission } = require('../utils/auth/checkAuth')
const router = express.Router()

// check api key
//router.use(apiKey)

// check permission key
//router.use(permission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api/upload', require('./upload'))

module.exports = router