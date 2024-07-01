'use strict'

const { Types } = require('mongoose')
const { products, clothes, electronics, funiture } = require('../models/product.model');
const { convertToObjectIdMongo } = require('../utils');

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


    static findAllProducts = async ({ limit, sort, page, filter, select }) => {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const product = await products.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(select)
            .lean()

        return product
    }

    static getProductByID = async ({ product_id, unSelect }) => {
        return await products.findById(product_id).select(unSelect)
    }

    static async updateProductByID({ productID, bodyUpdate, model, isNew = true }) {
        return await model.findByIdAndUpdate(productID, bodyUpdate, { new: isNew })
    }

    static async checkProductByServe(products) {

        console.log("checkProductServer", products);
        return await Promise.all(products.map(async product => {
 
            const foundProduct = await this.getProductByID({product_id: convertToObjectIdMongo(product.product_id)})
 
            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    product_id: product.product_id
                }
            }
        }))
    }
}

module.exports = ProductRepo