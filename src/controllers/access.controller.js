'use strict'

const { OK, Created } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        new Created( {
            message: 'Register OK',
            metaData: await AccessService.signUp(req.body)
       }).send(res)
    }
}

module.exports = new AccessController()