'use strict'

const productTypeConst = require('../common/const/productType.const');
const { BadRequestError } = require('../core/error.response')
const { products, clothes, electronics } = require('../models/product.model')

class ProductFactory {
    static async createProduct(type, payload) {
        console.log("type and payload", {type, payload });
        switch (type) {
            case productTypeConst.Electronics:
                return new Electronics(payload).createProduct()
            case productTypeConst.Clothing:
                return new Clothing(payload).createProduct()        
            default:
                throw new BadRequestError('Invalid product type')
        }
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
        return await products.create({...this, _id: product_id})
    }

}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Create new clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElec = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElec) throw new BadRequestError('Create new newElec error')

        console.log("newElect", newElec);

        const newProduct = await super.createProduct(newElec._id)
        if(!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newElec = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElec) throw new BadRequestError('Create new newElec error')

        console.log("newElect", newElec);

        const newProduct = await super.createProduct(newElec._id)
        if(!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

module.exports = ProductFactory