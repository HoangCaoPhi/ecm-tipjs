'use strict'

const { Types } = require('mongoose')
const { inventoryModel } = require('../models/inventory.model')
const { convertToObjectIdMongo } = require('../utils')

class InventoryRepo {
    static async insertInventory({ productID, shopID, stock, location = "Viet Nam" }) {
        return await inventoryModel.create({
            inven_product_id: productID,
            inven_shop_id: shopID,
            inven_location: location,
            inven_stock: stock
        })
    }

    static async reservationInventory({ productID, quantity, cartID }) {
        const query = {
            inven_product_id: convertToObjectIdMongo(productID),
            inven_stock: {
                $gte: quantity
            },
            updateSet: {
                $inc: {
                    inven_stock: -quantity
                },
                $push: {
                    inven_reservations: {
                        quantity,
                        cartID,
                        createOn: new Date()
                    }
                }
            }
        },
            options = {
                upsert: true, new: true
            }

        return await inventoryModel.updateOne(query, update)
    }

    static async updateInventory({
        stock,
        productID,
        shopID,
        location
    }) {
        const query = { inven_shop_id: shopID, inven_product_id: productID },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }
            },
            options = {
                upsert: true,
                new: true
            }

        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryRepo