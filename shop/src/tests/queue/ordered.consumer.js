'use strict';
const amqp = require('amqplib');

async function consumerOrderedMessage() {
    try {
        // Kết nối tới RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        
        // Tạo kênh kết nối
        const channel = await connection.createChannel();

        const queueName = 'ordered-queued-message';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`Waiting for messages in queue: ${queueName}`);

        channel.prefetch(1);
        
        // Tiêu thụ tin nhắn từ hàng đợi
        channel.consume(queueName, msg => {
            const message = msg.content.toString();
            setTimeout(() => {
                console.log('Received message:', message);
                channel.ack(msg);
            }, Math.random() * 1000);
        }, {
            noAck: false
        });

    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        process.exit(1);
    }
}

consumerOrderedMessage().catch(err => console.error(err));
