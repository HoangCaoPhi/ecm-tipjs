'use strict'
const amqp = require('amqplib');

async function consumerOrderedMessage() {
    try {
        // Kết nối tới RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        
        // Tạo kênh kết nối
        const channel = await connection.createChannel();

        const queueName = 'ordered-queued-message';
 
        await channel.assertQueue(queueName, { durable: true });
 

        for (let index = 0; index < 10; index++) {
             const message = `order numer: ${index}`;
             channel.sendToQueue(queueName, Buffer.from(message), {persistent: true});
             console.log(`Đã gửi tin nhắn: ${message.toString()}`);
        }

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

consumerOrderedMessage().catch(err => console.error(err));