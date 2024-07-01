'use strict'

const { CartState } = require("../common/enum/cart/state.enum")
const { CartModel } = require("../models/cart.model")

class CartRepo {
    static async getCartByUserID(userID) {
        return await CartModel.findOne({ cart_user_id: userID })
    }

    static async createUserCart({ userID, product }) {
        const query = { cart_user_id: userID, cart_state: CartState.Active },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = {
                upsert: true,
                new: true
            }


        return await CartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateProductQuantity({ userID, product }) {
        const {
            product_id,
            quantity
        } = product

        const query = {
            cart_user_id: userID, 
            'cart_products.product_id': product_id,
            cart_state: CartState.Active
        },
        update = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },
        options = {
            upsert: true,
            new: true
        }

        return await CartModel.findOneAndUpdate(query, update, options)
    }

    static async deleteUserCart({userID, productID}) {
        console.log({userID, productID});
        const query = {cart_user_id: userID, cart_state: CartState.Active},
        updateSet = {
            $pull: {
                cart_products: {
                    product_id: productID
                }
            }
        }

        return await CartModel.updateOne(query, updateSet)
    }

    static async getListCartUser({userID}) {
        return await CartModel.findOne({
            cart_user_id: userID
        })
    }

    static async getCartByID(cartID) {
        return await CartModel.findOne({_id: cartID, cart_state: CartState.Active}).lean()
    }
}

module.exports = CartRepo