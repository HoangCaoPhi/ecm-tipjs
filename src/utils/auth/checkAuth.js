'use strict'

const { findByID } = require("../../services/apiKey.service")
const { HEADER } = require('../../common/const/header.const')

const apiKey = async (req, res, next) => {
    try {
        const key = req.header[HEADER.API_KEY]

        if (!key) {
            return res.status(403).json({
                message: 'Forbiden Error'
            })
        }

        //check obj key
        const objectKey = await findByID(key)

        if (!objectKey) {
            return res.status(403).json({
                message: 'Forbiden Error'
            })
        }

        req.objectKey = objectKey
        return next()

    } catch (error) {
        console.error(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'Permisison denied!'
            })
        }

        console.log('permisison', req.objectKey.permissions)
        const validPermission = req.objectKey.permissions.includes(permission)

        if(!validPermission) {
            return res.status(403).json({
                message: 'Permisison denied!'
            })
        }

        return next()
    }
}



module.exports = {
    apiKey,
    permission
}