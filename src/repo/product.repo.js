'use strict'

const { Types } = require('mongoose')
const { products, clothes, electronics, funiture } = require('../models/product.model')

class ProductRepo {
    static getProductByQuery = async ({ query, limit, skip }) => {
        console.log(query);
        return await products.find(query)
            .populate('product_shop', 'name email -_id')
            .limit(limit)
            .skip(skip)
            .lean()
    }

    static updateFieldIsPublishProductByShop = async ({ product_shop, product_id, is_publish_value }) => {
        const foundShop = await products.findOne({
            product_shop: new Types.ObjectId(product_shop),
            _id: new Types.ObjectId(product_id)
        })

        if (!foundShop) {
            return null
        }

        foundShop.is_draft = false
        foundShop.is_publish = is_publish_value

        const { modifiedCount } = await foundShop.updateOne(foundShop)
        return modifiedCount
    }

    static searchProductByKey = async ({ keySearch }) => {

        const regexSearch = new RegExp(keySearch)
        const result = await products.find({
            is_publish: true,
            $text: {
                $search: regexSearch
            }
        }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }).lean()

        return result
    }

}

module.exports = ProductRepo