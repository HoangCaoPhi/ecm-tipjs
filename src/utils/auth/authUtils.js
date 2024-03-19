'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../../helper/asyncHandler')
const { AuthFailureError } = require('../../core/error.response')
const { findByUserID } = require('../../services/keyToken.service')
const HEADER = require('../../common/const/header.const')
 
const createTokenPair = async (payload, publicKey, privatekey) => {
    const accessToken = await JWT.sign(payload, publicKey, {
        expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privatekey, {
        expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
        if(err) {
            console.error(`error verify:`, err);
        }
        else {
            console.log(`decode verify`, decode);
        }
    })

    return { accessToken, refreshToken }
}

const authentication = asyncHandler( async (req, res, next) => {
    const userID = req.headers[HEADER.CLIENT_ID]
    if(!userID) {
        throw new AuthFailureError('Invalid request')
    }

    const keyStore = await findByUserID(userID)
    if(!keyStore) throw new NotFoundError('Not found key store')

 
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid accessToken')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        console.log("decodeUserid", decodeUser);
        console.log("userID", userID);
        if(userID != decodeUser.userId) {
            throw new AuthFailureError('Invalid user')
        }
        req.keyStore = keyStore
        return next()
    }
    catch(error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}