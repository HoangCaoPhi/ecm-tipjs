'use strict'

const { BadRequestError, AuthFailureError, ForbidenError } = require("../core/error.response")
const shopModel = require("../models/shop.model")
const { getInfoData } = require("../utils")
const { createTokenPair, vefifyToken } = require("../utils/auth/authUtils")
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const shop = await findByEmail({ email })
        if (!shop) throw new BadRequestError('Shop not register')

        const match = bcrypt.compare(password, shop.password)
        if (!match) throw new AuthFailureError('Authentiocation Error')
 
        const shopID = shop._id
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
 
        const token = await createTokenPair({ userId: shopID, email: email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: token.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey,
            userID: shopID
        })

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop}),
            token
        }
    }

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
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    token
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }

    
    }

    static logOut = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeToken(keyStore._id)
        console.log({delKey});
        return delKey
    }

    /**
     * Check token used
     * @param {*} refreshToken 
     */
    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

        console.log("foundToken", foundToken);
        if(foundToken) {
            const {userId, email} = await vefifyToken(refreshToken, foundToken.privateKey)
            console.log({userId, email});
 
            await KeyTokenService.deleteKeyById(userId)

            throw new ForbidenError('Something wrong happend!! Please relogin')
        }     
        
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop not register')

        const {userId, email} = await vefifyToken(refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not register 2')

        const token = await createTokenPair({ userId: userId, email: email }, holderToken.publicKey, holderToken.privateKey)
 
        await holderToken.updateOne({
            $set: {
                refreshToken: token.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        }) 

        return {
            user: {userId, email},
            token
        }
    }
}

module.exports = AccessService