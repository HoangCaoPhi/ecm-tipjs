'use strict'

const { Types } = require('mongoose')
const { inventoryModel } = require('../models/inventory.model')

class InventoryRepo {
    static async insertInventory({ productID, shopID, stock, location = "Viet Nam" }) {
        return await inventoryModel.create({
            inven_product_id: productID,
            inven_shop_id: shopID,
            inven_location: location,
            inven_stock: stock
        })
    }
}

module.exports = InventoryRepo