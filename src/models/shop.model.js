'use strict'
const { mongoose, model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

var shopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLegth: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type:  Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, { timestamps: true, collection: COLLECTION_NAME });

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);