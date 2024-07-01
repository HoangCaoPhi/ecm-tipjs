'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./src/services/consumer.service')

const queueName = 'test-topic'

consumerToQueue(queueName).then(() => {
    console.log(`Message consumer start`);
}).catch(err => {
    console.log(err);
})

consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumerToQueueNormal start`);
}).catch(err => {
    console.log(err);
})

consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumerToQueueFailed start`);
}).catch(err => {
    console.log(err);
})