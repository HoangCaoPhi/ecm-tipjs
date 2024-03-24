'use strict'

const { ApplyToEnum } = require("../common/enum/discount/applyTo.enum")
const { DiscountTypeEnum } = require("../common/enum/discount/discountType.enum")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const DiscountRepo = require("../repo/discount.repo")
const ProductRepo = require("../repo/product.repo")

const { convertToObjectIdMongo } = require("../utils")

class DiscountService {
    static async createDiscountCode(body) {    
  
        if (new Date() < new Date(body.discount_start_date) || new Date() > new Date(body.discount_end_date)) {
            throw new BadRequestError("Discount Error")
        }

        if (new Date(body.discount_start_date) >= new Date(body.discount_end_date)) {
            throw new BadRequestError("Start day must be less to end date")
        }

        const foundDiscount = await DiscountRepo.getDiscountBy({
            discount_code: body.discount_code,
            discount_shop_id: convertToObjectIdMongo(body.discount_shop_id)
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount Exist")
        }
 
        const newDiscount = DiscountRepo.createDiscount(body)

        return newDiscount
    }

    static async updateDiscount() {

    }

    static async getAllProductWithDiscount({code, shopID, userID, limit, page}) {
        const foundDiscount = await DiscountRepo.getDiscountBy({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongo(shopID)
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount Not Exist")
        }

        const { discount_apply_to, discount_product_ids} = foundDiscount

        let products;
        if(discount_apply_to === ApplyToEnum.All) {
            products = await ProductRepo.findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongo(shopID),
                    is_publish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_apply_to === ApplyToEnum.Specific) {
            products = await ProductRepo.findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    is_publish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    static async getAllDiscountByShop({
        limit, page, shopID, 
    }) {
        const discount = await DiscountRepo.findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertToObjectIdMongo(shopID),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shop_id']
        })

        return discount
    }

    static async getDiscountAmount({codeID, userID, shopID, products}) {
        const foundDiscount = await DiscountRepo.getDiscountBy({discount_shop_id: shopID, discount_code: codeID})

        if(!foundDiscount) {
            throw new NotFoundError('Discount not exits')
        }

        const {
            discount_is_active,
            discount_max_use,
            discount_users_used,
            discount_type,
            discount_value,
            discount_start_date,
            discount_min_price_order,
            discount_max_uses_per_user,
            discount_end_date
        } = foundDiscount

        if(!discount_is_active)  throw new NotFoundError('Discount not exits')
        if(!discount_max_use) throw new NotFoundError('Discount are out')

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired')
        }

        let totalOrder = 0
        if(discount_min_price_order > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if(totalOrder < discount_min_price_order) {
                throw new NotFoundError(`Discount require minium order value = ${discount_min_price_order}`)
            }            
        }

        if(discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find( user => user.userID === userID)
            if(userUseDiscount) {

            }
        }

        const amount = discount_type === DiscountTypeEnum.FixedAmount ? 
                    discount_value : totalOrder * (discount_value / 100) 

        
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({shopID, codeID}) {
        const deleteDiscount = await DiscountRepo.deleteDiscount({shopID, codeID}) 
        return deleteDiscount
    }

    static async cancelDiscountcode({codeID, shopID, userID}) {
        const foundDiscount = await DiscountRepo.getDiscountBy({discount_code: codeID, discount_shop_id: convertToObjectIdMongo(shopID)})

        if(!foundDiscount) {

        }

        const result = await DiscountRepo.updateDiscount({disCountID: foundDiscount._id, userID})

        return result
    }
}

module.exports = DiscountService