'use strict'

const { BadRequestError } = require('../core/error.response')
const { products, clothes, electronics, funiture } = require('../models/product.model')
const ProductRepo = require('../repo/product.repo')

class ProductFactory {
    static productRegistry = {}
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError('Invalid product type')

        return new productClass(payload).createProduct()
    }

    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, is_draft: true }
        return await ProductRepo.getProductByQuery({ query: query, limit: limit, skip: skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await ProductRepo.updateFieldIsPublishProductByShop({ product_shop: product_shop, 
            product_id: product_id, is_publish_value: true })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await ProductRepo.updateFieldIsPublishProductByShop({ product_shop: product_shop, 
            product_id: product_id, is_publish_value: false })
    }

    static async getAllProductPublish({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, is_publish: true }
        return await ProductRepo.getProductByQuery({ query: query, limit: limit, skip: skip })
    }

    static async searchProduct({ keySearch }) {
        return await ProductRepo.searchProductByKey({ keySearch })
    }

}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_design,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes }) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_design = product_design,
            this.product_price = product_price,
            this.product_quantity = product_quantity,
            this.product_type = product_type,
            this.product_shop = product_shop,
            this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await products.create({ ...this, _id: product_id })
    }

}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElec = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElec) throw new BadRequestError('Create new newElec error')

        console.log("newElect", newElec);

        const newProduct = await super.createProduct(newElec._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newElec = await funiture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElec) throw new BadRequestError('Create new newElec error')

        console.log("newElect", newElec);

        const newProduct = await super.createProduct(newElec._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory