const redisPubsubService = require('../services/redis.pubsub.service');

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subcribe('purchase_event', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(product) {
        console.log(`Update inventory ${product}`);
    }
}

module.exports = new InventoryServiceTest()