'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../../helper/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../../core/error.response')
const { findByuserID } = require('../../services/keyToken.service')
const HEADER = require('../../common/const/header.const')
const headerConst = require('../../common/const/header.const')
 
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

    const keyStore = await findByuserID(userID)
    if(!keyStore) throw new NotFoundError('Not found key store')

    if(req.headers[headerConst.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[headerConst.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userID != decodeUser.userID) {
                throw new AuthFailureError('Invalid user')
            }
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        }
        catch(error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid accessToken')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        console.log("decodeuserID", decodeUser);
        console.log("userID", userID);
        if(userID != decodeUser.userID) {
            throw new AuthFailureError('Invalid user')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    }
    catch(error) {
        throw error
    }
})


const vefifyToken = async(token, keySecret) => {
    return await JWT.verify(token, keySecret)
}   

module.exports = {
    createTokenPair,
    authentication,
    vefifyToken
}