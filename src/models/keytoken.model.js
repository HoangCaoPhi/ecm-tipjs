'use strict'

const { mongoose, model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true
    },
    privateKey: {
        type: String,
        require: true
    },
    /** Refresh token đã được sử dụng */
    refreshTokensUsed: {
        type: Array, default: []
    },
    refreshToken: {
        type: String, require: true
    }
    ,
}, { timestamps: true, collection: COLLECTION_NAME });

module.exports = model(DOCUMENT_NAME, keyTokenSchema);