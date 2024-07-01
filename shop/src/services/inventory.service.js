'use strict'

const { BadRequestError } = require("../core/error.response")
const InventoryRepo = require("../repo/inventory.repo")
const ProductRepo = require("../repo/product.repo")

class InventoryService {
    static async addStockToInventory({
        stock,
        productID,
        shopID,
        location = 'lê văn lương hcm'
    }) {
        const product = await ProductRepo.getProductByID({product_id: productID})

        if(!product) {
            throw new BadRequestError('The product does not exist')            
        }

        return await InventoryRepo.updateInventory({
            stock,
            productID,
            shopID,
            location
        })
    }
}

module.exports = InventoryService