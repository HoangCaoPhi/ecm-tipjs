'use strict'

const { mongoose, model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

var schema = new Schema({
    key: {
        type: Schema.Types.String,
        require: true,
        unique: true
    },
    status: {
        type: Schema.Types.Boolean,
        default: true
    },
    permissions: {
        type:  [String],
        require: true,
        enum: ['0000', '1111', '2222']
    }
}, 
{ timestamps: true, collection: COLLECTION_NAME });

module.exports = model(DOCUMENT_NAME, schema);