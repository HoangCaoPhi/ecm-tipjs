'use strict'

const { model, Schema } = require('mongoose');
const { CartState } = require('../common/enum/cart/state.enum');
 
const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts'

var schema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: [CartState.Active, CartState.Completed, CartState.Pending, CartState.Failed],
        default: CartState.Active
    },
    /**
     * [
     *  {
     *      productID,
     *      shopID,
     *      quantity,
     *      name,
     *      price
     *  }
     * ]
     */
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    cart_count_product: {
        type: Number        
    },
    cart_user_id: {
        type: Number,
        required: true
    }    

}, { timestamps: true, collection: COLLECTION_NAME, timestamps: {
    createdAt: 'createdBy',
    updatedAt: 'modifiedBy'
} });

module.exports = {
    CartModel: model(DOCUMENT_NAME, schema)
};