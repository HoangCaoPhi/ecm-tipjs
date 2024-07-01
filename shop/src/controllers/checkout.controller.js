'use strict'

const { SuccessResponse } = require("../core/success.response")
const CheckoutService = require("../services/checkout.service")
 
class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'checkoutReview success!',
            metaData: await CheckoutService.checkoutReview({
                cartID: req.body.cart_id,
                userID: req.body.user_id,
                shopOrderIds: req.body.shop_order_ids
            })
        }).send(res)
    }
}

module.exports = new CheckoutController()
