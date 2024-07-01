'use strict'
const amqp = require('amqplib');

const log = console.log
console.log = function() {
    log.apply(console, [new Date()].concat(arguments));
}


async function connectAndSend() {
    try {
        // Kết nối tới RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        
        // Tạo kênh kết nối
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationExchange';
        const notificationQueue = 'notificationQueueProcess';
        const notificationExchangeDLX = 'notificationExchangeDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 1. Tạo Exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true });

        // 2. Tạo Queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });

        // 3. Gán Queue vào Exchange
        await channel.bindQueue(queueResult.queue, notificationExchange, '');

        // 4. Gửi tin nhắn
        const msg = 'A new product hihih';
        console.log(`producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        });

        // Đóng kết nối sau khi gửi tin nhắn và nhận tin nhắn
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);        
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        process.exit(1);
    }
}

connectAndSend();
