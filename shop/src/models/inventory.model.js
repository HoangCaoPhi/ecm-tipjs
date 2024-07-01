'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

var schema = new Schema({
    inven_product_id: {
        type: Schema.Types.ObjectId, ref: "product"
    },
    /**
     * Vị trí kho
     */
    inven_location: {
        type: String,
        default: "Viet Nam"
    },
    /**
     * Số lượng hàng tồn kho
     */
    inven_stock: {
        type: Number, require: true
    },
    inven_shop_id: {
        type: Schema.Types.ObjectId, ref: 'Shop'
    },
    /**
     * Đặt trước, khi thêm vào giỏ hàng
     */
    inven_reservations: {
        type: Array,
        default: []
    }
}, { timestamps: true, collection: COLLECTION_NAME });

module.exports = {
    inventoryModel: model(DOCUMENT_NAME, schema)
};