'use strict'

const amqp = require('amqplib')

const connectToRabbitMq = async() => {
    try {
         // Kết nối tới RabbitMQ server
         const connection = await amqp.connect('amqp://localhost');
         if(!connection) throw new Error("Connection to rabbitMQ failed");
         // Tạo kênh kết nối
         const channel = await connection.createChannel();

         return {channel, connection};
    }
    catch {

    }
}

const connectToRabbitMqForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMq();

        const queueName = 'test-queue';
        const message = 'Hello test';

        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message));

        await connection.close();
    } catch (error) {
        console.error(error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log('Waiting for message...')

        channel.consume(queueName, msg => {
            console.log(`Recieved message... ${queueName}::`, msg.content.toString())
            // 1. Find user following shop
            // 2. Send message to user
            // 3. Yes, ok
            // 4. Error, setup DLX                        
        }, {
            noAck: true
        })

    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    connectToRabbitMq,
    connectToRabbitMqForTest,
    consumerQueue
}