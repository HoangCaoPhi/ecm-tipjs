'use strict'

const { model, Schema } = require('mongoose');
const { ApplyToEnum } = require('../common/enum/discount/applyTo.enum');

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

var schema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: "fixed_amount"
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_use: {
        type: Number,
        required: true
    },
    discount_used_count: {
        type: Number,
        required: true
    },
    discount_users_used: {
        type: Array,
        default: []
    },
    discount_max_uses_per_user: {
        type: Number,
        required: true
    },
    discount_min_price_order: {
        type: Number,
        required: true
    },
    discount_shop_id: {
        type: Schema.ObjectId,
        ref: "Shop"
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_apply_to: {
        type: String,
        required: true,
        enum: [ApplyToEnum.All, ApplyToEnum.Specific]
    },
    discount_product_apply_ids: {
        type: Array,
        default: []
    }
}, { timestamps: true, collection: COLLECTION_NAME });

module.exports = {
    discountModel: model(DOCUMENT_NAME, schema)
};