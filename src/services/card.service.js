'use strict'

const CartRepo = require("../repo/cart.repo")
const ProductRepo = require("../repo/product.repo")
const { BadRequestError, NotFoundError } = require("../core/error.response")

class CartService {
    static async addProductToCart({userID, product = {}}) {
        // check cart exitst
        const cartUser = await CartRepo.getCartByUserID(userID)
        if(!cartUser) {
            console.log("createUserCart");
            await CartRepo.createUserCart({userID: userID, product: product})
        }

        // if product is empty
        if(!cartUser.cart_products.length) {
            cartUser.cart_products = [product]
            return await cartUser.save()
        }

        console.log("updateProductQuantity");
        // if cart exits and has duplicate product => update quantity
        return await CartRepo.updateProductQuantity({userID, product})
    }

    static async addProductToCartV2({userID, shop_order_ids}) {
        console.log("{userID, shop_order_ids}", {userID, shop_order_ids});
        const {
            product_id,
            quantity,
            old_quantity
        }
        = shop_order_ids[0]?.item_products[0]

        // check product exist
        const foundProduct = await ProductRepo.getProductByID({product_id: product_id})
        if(!foundProduct) {
            throw new NotFoundError('Product not exitst')
        }

        if(foundProduct.product_shop.toString() !=  shop_order_ids[0]?.shop_id) {
            throw new NotFoundError('Shop not exitst')
        }

        if(quantity === 0) {
            // xóa sản phẩm

        }

        return await CartRepo.updateProductQuantity({
            userID,
            product: {
                product_id,
                quantity: quantity - old_quantity
            }
        })


    }

    static async deleteUserCart({userID, productID}) {
        return await CartRepo.deleteUserCart({userID, productID})
    }

    static async getListCart({userID}) {
        console.log("abc", {userID});
        return await CartRepo.getListCartUser({userID})
    }
}


module.exports = CartService