'use strict'

const { connectToRabbitMq, consumerQueue } = require('../dbs/init.rabbitmq')

const log = console.log
console.log = function () {
    log.apply(console, [new Date()].concat(arguments));
}

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMq();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(error);
        }
    },

    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMq();
            const notificationQueue = 'notificationQueueProcess';

            // 1. TTL
            // setTimeout(() => {
            //     channel.consume(notificationQueue, msg => {
            //         console.log(`send notification queue success`, msg.content.toString());
            //         channel.ack(msg);
            //     });
            // }, 15000);

            // 2. Lỗi logic
            channel.consume(notificationQueue, msg => {
                try {
                    const numberTest = Math.random();
                    console.log(numberTest)
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed')
                    }
                    console.log('Send notifcation success', msg.content.toString());
                    channel.ack(msg);
                }
                catch (exception) {
                    //console.log('Send notification error', exception.message);
                    channel.nack(msg, false, false);
                }
            });
        } catch (error) {
            console.error(`send notification queue error ${error.message}`, error);
        }
    },

    consumerToQueueFailed: async (queueName) => {
        try {
            const notificationExchangeDLX = 'notificationExchangeDLX';
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

            const { channel } = await connectToRabbitMq();
            const notificationQueueHandler = 'notificationQueueHotfix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            });

            const queueResult = await channel.assertQueue(notificationQueueHandler, {
                exclusive: false
            });

            await channel.bindQueue(notificationQueueHandler, notificationExchangeDLX, notificationRoutingKeyDLX);

            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`this notification hotfix error`, msgFailed.content.toString());
            }, {
                noAck: true
            });

        } catch (error) {
            console.error(error.message, error);
        }
    }
}

module.exports = messageService;
