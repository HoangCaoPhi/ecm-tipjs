const RedisPubSubService = require('../services/redis.pubsub.service');

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        };

        console.log(JSON.stringify(order));

        // Giả sử RedisPubSubService có phương thức publish
        RedisPubSubService.publish('purchase_event', JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();
