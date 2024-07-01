'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

var schema = new Schema({   
    comment_productId: {type: Schema.Types.ObjectId, ref: 'product'},
    comment_userId: {type: Number, default: 1},
    comment_content: {type: String, default: 'text'},
    comment_left: {type: Number, default: 0},
    comment_right: {type: Number, default: 0},
    comment_parentId: {type: Schema.Types.ObjectId, ref: ''},
    isDeleted: {type: Boolean, default: false}
}, { timestamps: true, collection: COLLECTION_NAME });

module.exports = model(DOCUMENT_NAME, schema);
