'use strict'

const { model, Schema } = require('mongoose');
const { OrderStatusEnum } = require('../common/enum/order/orderStatus.enum');
 
const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const schema = new Schema({
    order_user_id: {
        type: Number,
        require: true
    },
    /**
     * đơn hàng thanh toán
     * {
     *      totalPrice,
     *      
     * }
     */
    order_checkout: {
        type: Object,
        default: {}
    },
    /**
     *  street
     *  city
     *  state
     *  country
     */
    order_shipping: {
        type: Object,
        default: {}
    },

    order_payment: {
        type: Object,
        default: {}
    },
    order_products: {
        type: Array,
        required: true
    },
    order_tracking_number: {
        type: String,
        default: "#000126032024"
    },
    order_status: {
        type: String,
        enum: [OrderStatusEnum.Pending, 
               OrderStatusEnum.Shipped, 
               OrderStatusEnum.Cancelled, 
               OrderStatusEnum.Confirmed,
               OrderStatusEnum.Delivered],
        defaut: OrderStatusEnum.Pending
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

 

module.exports = {
  OrderModel: model(DOCUMENT_NAME, schema)
};