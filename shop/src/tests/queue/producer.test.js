const amqp = require('amqplib');

async function connectAndSend() {
    try {
        // Kết nối tới RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        
        // Tạo kênh kết nối
        const channel = await connection.createChannel();

        // Khai báo một queue để gửi tin nhắn đến
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, { durable: true });

        // Gửi một tin nhắn
        const message = 'Hello RabbitMQ!';
        channel.sendToQueue(queueName, Buffer.from(message));

        console.log(`Đã gửi tin nhắn: ${message}`);

        // Đợi nhận tin nhắn từ queue
        // await consumeMessage(channel, queueName);

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

async function consumeMessage(channel, queueName) {
    try {
        // Tiêu thụ (consume) tin nhắn từ queue
        await channel.consume(queueName, (message) => {
            if (message !== null) {
                console.log(`Đã nhận tin nhắn: ${message.content.toString()}`);
                channel.ack(message); // Xác nhận đã xử lý tin nhắn thành công
            }
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi khi tiêu thụ tin nhắn:', error);
    }
}

// Kết nối và gửi, nhận tin nhắn
connectAndSend();
