'use strict'

const { filter } = require("lodash")
const keytokenModel = require("../models/keytoken.model")
const { Types } = require("mongoose")

class KeyTokenService {
    /**
     * Tạo key token để lưu vào database
     * @param {*} param0 
     * @returns 
     */
    static createKeyToken = async({userID, publicKey, privateKey, refreshToken}) => {
        
        // Obsolate
        // const tokens = await keytokenModel.create({
        //     user: userID,
        //     publicKey: publicKey,
        //     privateKey: privateKey
        // })

        const filter = { user: userID }
        const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
        const options = { upsert: true, new: true }

        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

        return tokens ? tokens.publicKey : null
    }

    static findByUserID = async (userID) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userID)}).lean()
    }

    static removeToken = async(id) => {
        return await keytokenModel.deleteOne( id )
    }

    static findByRefreshTokenUsed = async(refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken  = async(refreshToken) => {
        return await keytokenModel.findOne({refreshToken: refreshToken}) 
    }

    static deleteKeyById = async(userId) => {
        return await keytokenModel.deleteOne({user: new Types.ObjectId(userId)})
    }
}

module.exports = KeyTokenService