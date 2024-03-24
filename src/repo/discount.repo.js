'use strict'

const { discountModel } = require("../models/discount.model")
const { convertSelectArrayToUnSelectObj, convertSelectArrayToSelectObj, convertToObjectIdMongo } = require("../utils")
 
class DiscountRepo {
    static async getDiscountBy({ discount_shop_id, discount_code }) {        
        return await discountModel.findOne({
            discount_code: discount_code,
            discount_shop_id: discount_shop_id
        }).lean()
    }

    static async createDiscount(discount) {       
        console.log("discount", discount); 
        return  await discountModel.create(discount)
    }

    static async findAllDiscountCodeUnSelect({limit = 1, page = 1, sort = 'ctime', filter, unSelect}) {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const product = await discountModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(convertSelectArrayToUnSelectObj(unSelect))
            .lean()

        return product
    }

    static async findAllDiscountCodeSelect({limit = 1, page = 1, sort = 'ctime', filter, select}) {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const product = await model.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(convertSelectArrayToSelectObj(select))
            .lean()

        return product
    }

    static async deleteDiscount({shopID, codeID}) {
        return await discountModel.findOneAndDelete({
            discount_code: codeID,
            discount_shop_id: shopID
        })
    }

    static async updateDiscount({disCountID, userID}) {
        return await discountModel.findByIdAndUpdate(disCountID, {
            $pull: {
                discount_users_used: userID
            },
            $inc: {
                discount_max_use: 1,
                discount_used_count: -1
            }
        })
    }
}

module.exports = DiscountRepo