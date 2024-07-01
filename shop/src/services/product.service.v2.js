'use strict'

const { BadRequestError } = require('../core/error.response')
const inventoryModel = require('../models/inventory.model')
const { products, clothes, electronics, funiture } = require('../models/product.model')
const InventoryRepo = require('../repo/inventory.repo')
const ProductRepo = require('../repo/product.repo')
const { convertSelectArrayToSelectObj, convertSelectArrayToUnSelectObj, removeNullAndUndefined, updateNestedObjectParse } = require('../utils')
const NotificationService = require('../services/notification.service')
const notificationType = require('../common/enum/notification/notification.type')
 
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
        return await ProductRepo.updateFieldIsPublishProductByShop({
            product_shop: product_shop,
            product_id: product_id, is_publish_value: true
        })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await ProductRepo.updateFieldIsPublishProductByShop({
            product_shop: product_shop,
            product_id: product_id, is_publish_value: false
        })
    }

    static async getAllProductPublish({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, is_publish: true }
        return await ProductRepo.getProductByQuery({ query: query, limit: limit, skip: skip })
    }

    static async searchProduct({ keySearch }) {
        return await ProductRepo.searchProductByKey({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { is_publish: true } }) {
        return ProductRepo.findAllProducts({
            limit, sort, filter, page, select: convertSelectArrayToSelectObj([
                'product_name', 'product_price', 'product_thumb'
            ])
        })
    }

    static async getProductByID({ product_id }) {
        return ProductRepo.getProductByID({
            product_id, unSelect: convertSelectArrayToUnSelectObj([
                '__v'
            ])
        })
    }

    static async updateProduct({ type, payload, productID }) {
        console.log("aaaaaaaaaaa");
        console.log('abasdfsfđsf', { type, payload, productID });
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError('Invalid product type')

        return new productClass(payload).updateProduct(productID)
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
        var product = await products.create({ ...this, _id: product_id })

        if(product) {
            await InventoryRepo.insertInventory({
                productID: product._id,
                shopID: this.product_shop,
                stock: this.product_quantity
            })
        }

        NotificationService.pushNotificationToSystem({
            type: notificationType.Shop001,
            receiveId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_attributes
            }
        }).then(rs => console.log(rs))            
        .catch(console.error)

        return product
    }

    async updateProduct(productID, bodyUpdate) {
        return await ProductRepo.updateProductByID({
            productID: productID,
            bodyUpdate: bodyUpdate,
            model: products,
        })
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

    async updateProduct(productID) {
        // remove attr is null or undefinded
        const objectParams = this

        // check update
        if (objectParams.product_attributes) {
            await ProductRepo.updateProductByID({
                productID: productID,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
                model: clothes,
            })
        }

        const updateProduct = await super.updateProduct(productID, updateNestedObjectParse(objectParams))
        return updateProduct
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