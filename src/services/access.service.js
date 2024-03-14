'use strict'

const shopModel = require("../models/shop.model")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async({name, email, password}) => {
        const existEmail = await shopModel.findOne({ email }).lean()

        if(existEmail) {
            return {
                code: 'xxxx',
                message: 'Sho already registed!'
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create( {
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if(newShop) {
            // create private key. public key
            const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096
            })

        }


    }
}

module.exports = AccessService