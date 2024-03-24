'use strict'

const { SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'createDiscountCode success!',
            metaData: await DiscountService.createDiscountCode({
                ...req.body,
                discount_shop_id: req.user.userID
            })
        }).send(res)
    }

    getAllDiscountByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount success!',
            metaData: await DiscountService.getAllDiscountByShop({
                ...req.query,
                shopID: req.user.userID
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount success!',
            metaData: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllProductWithDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount success!',
            metaData: await DiscountService.getAllProductWithDiscount({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()
