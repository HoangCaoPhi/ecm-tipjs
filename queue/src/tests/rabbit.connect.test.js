'use strict'

const { connectToRabbitMqForTest } = require('../dbs/init.rabbitmq')

describe('RabbitMQ Connection', () => {
    it('Should connect to RabbitMQ successfully', async () => {
        const result = await connectToRabbitMqForTest()
        expect(result).toBeUndefined()  
    })
})
