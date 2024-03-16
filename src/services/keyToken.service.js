'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async({userID, publicKey, privateKey}) => {
 
        const tokens = await keytokenModel.create({
            user: userID,
            publicKey: publicKey,
            privateKey: privateKey
        })

        return tokens ? tokens.publicKey : null
    }
}

module.exports = KeyTokenService