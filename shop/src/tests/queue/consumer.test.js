const amqp = require('amqplib')
 
const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'

        await channel.assertQueue(queueName, {
            durable: true,            
        })

        channel.consume(queueName,  (message) => {
            console.log(`Recieve message: ${message.content.toString()}`);
        })
    }
    catch(error) {
        console.error(error)
    }
}

runConsumer().catch(console.error)