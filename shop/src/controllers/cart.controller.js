'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/card.service")

class CartController {
    addProductToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'addProductToCart success!',
            metaData: await CartService.addProductToCart({
                ...req.body,
                userID: req.body.cart_user_id
            })
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'addProductToCartV2 success!',
            metaData: await CartService.addProductToCartV2({
                userID: req.body.user_id,
                ...req.body
            })
        }).send(res)
    } 

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleteUserCart success!',
            metaData: await CartService.deleteUserCart(req.body)
        }).send(res)
    } 
 
    list = async (req, res, next) => {
        new SuccessResponse({
            message: 'list success!',
            metaData: await CartService.getListCart(req.query)
        }).send(res)
    } 
}

module.exports = new CartController()
