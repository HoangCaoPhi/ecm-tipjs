'use strict'

const { OK, Created, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {

    login = async(req, res, next) => {
        new SuccessResponse(
        {
            metaData: await AccessService.login(req.body)
        }
        ).send(res)
    }

    signUp = async (req, res, next) => {
        new Created( {
            message: 'Register OK',
            metaData: await AccessService.signUp(req.body)
       }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse( {
            message: 'Logout OK',
            metaData: await AccessService.logOut({keyStore: req.keyStore})
       }).send(res)
    }
}

module.exports = new AccessController()