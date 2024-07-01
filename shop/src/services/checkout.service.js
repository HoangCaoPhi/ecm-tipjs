'use strict'

const CartRepo = require("../repo/cart.repo")
const ProductRepo = require("../repo/product.repo")
const DiscountService = require("./discount.service")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const RedisService = require("./redis.service")
const OrderRepo = require("../repo/order.repo")

class CheckoutService {
    static async checkoutReview({
        cartID, userID, shopOrderIds
    }) {
        console.log("{cartID, userID, shopOrderIds}", {
            cartID, userID, shopOrderIds
        });
        // check cart id exits
        const foundCart = await CartRepo.getCartByID(cartID)
        if(!foundCart) throw new BadRequestError("Cart does not exitst")

        const checkoutOrder = {        
            totalPrice: 0,
            freeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }

        const shopOrderIdsNew = []

        // tính tổng bill
        for (let index = 0; index < shopOrderIds.length; index++) {
            const {shop_id, shop_discount = [], item_products = []} = shopOrderIds[index];
            const checkProductServer = await ProductRepo.checkProductByServe(item_products)

            //console.log("checkProductServer", checkProductServer);

            if(!checkProductServer[0]) {
                throw new BadRequestError('order wrong')
            }

            const checkoutPrice = await checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                shop_id,
                shop_discount,
                price_raw: checkoutPrice,
                price_apply_discount: checkoutPrice,
                item_products: checkProductServer
            }

            //console.log("itemCheckout", itemCheckout);

            if(shop_discount.length > 0) {
   
                const {
                    totalPrice = 0,
                    discount = 0
                } = await DiscountService.getDiscountAmount({
                    codeID: shop_discount[0].code_id,
                    shopID: shop_id,
                    userID: userID,
                    products: checkProductServer
                })
                
                checkoutOrder.totalDiscount += discount

                if(discount > 0)  {
                    itemCheckout.price_apply_discount = checkoutPrice - discount
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.price_apply_discount
            shopOrderIdsNew.push(itemCheckout)
        }

        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }
    }

    static async orderByUser({
        //shopOrderIdsNew,
        cartID,
        userID,
        userAddress = {},
        userPayment = {}
    })
    {
        const {shopOrderIdsNew, checkoutOrder} = await CheckoutService.checkoutReview({
            cartID, userID, shopOrderIds: shopOrderIdsNew
        })

        // check hàng tồn kho
        const products = shopOrderIdsNew.flatMap(order => order.item_products)

        console.log("products", products);

        const acquireProduct = []

        for (let index = 0; index < products.length; index++) {
            const {product_id, quantity} = products[index];
            const keyLock = await RedisService.acquireLock({
                productID: product_id,
                quantity: quantity,
                cartID: cartID
            })

            acquireProduct.push(keyLock ? true : false)

            if(keyLock) {
                //await RedisService.releaseLock(keyLock)
            }
        }

        // nếu có một sp hết hàng trong kho
        if(acquireProduct.includes(false)) {
            throw new BadRequestError("Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng")
        }

        const newOrder = await OrderRepo.createOrder({
            order_user_id: userID,
            order_checkout: checkoutOrder,
            order_shipping: userAddress,
            order_payment: userPayment,
            order_products: shopOrderIdsNew
        })

        if(newOrder) {

        }

    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByAdmin() {

    }
}

module.exports = CheckoutService