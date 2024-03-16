'use strict'

const { BadRequestError } = require("../core/error.response")
const shopModel = require("../models/shop.model")
const { getInfoData } = require("../utils")
const { createTokenPair } = require("../utils/auth/authUtils")
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const existEmail = await shopModel.findOne({ email }).lean()

        if (existEmail) {
            throw new BadRequestError('Error: Shop alredy registerd!')
        }
         
        const passwordHash = await bcrypt.hash(password, 10)

        console.log(`Password hash`, passwordHash);

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // create private key. public key
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            console.log(`Private ${privateKey} and Public key: ${publicKey}`);

            const userId = newShop._id

            const keyStore = await KeyTokenService.createKeyToken({ userID: userId, publicKey: publicKey, privateKey: privateKey })

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'publicKeyString error!!'
                }
            }
 
            const token = await createTokenPair({ userId: userId, email: email }, publicKey, privateKey)
            console.log(`Create token`, token);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    token
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }

    }
}

module.exports = AccessService