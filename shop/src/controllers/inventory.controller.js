'use strict'

const { OK, Created, SuccessResponse } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")
 
class InventoryController {
    addStockToInventory = async(req, res, next) => {
        new SuccessResponse(
        {
            metaData: await InventoryService.addStockToInventory(req.body)
        }
        ).send(res)
    }
 
}

module.exports = new InventoryController()