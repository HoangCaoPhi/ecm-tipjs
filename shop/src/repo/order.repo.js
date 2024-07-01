'use strict'

const { Types } = require('mongoose')
const { convertToObjectIdMongo } = require('../utils')

class OrderRepo {
    static async createOrder({
        order_user_id,
        order_checkout,
        order_shipping,
        order_payment,
        order_products
    }) {

    }
}

module.exports = OrderRepo