'use strict'

const JWT = require('jsonwebtoken')

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

module.exports = {
    createTokenPair
}