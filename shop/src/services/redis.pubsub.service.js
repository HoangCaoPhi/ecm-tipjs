const Redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.subcribeClient = Redis.createClient()
        this.publishClient = Redis.createClient() 
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publishClient.publish(channel, message, (err, reply) => {
                if (err) {
                    console.log(`error: ${JSON.stringify(err)}`);
                    reject(err)
                }
                else {
                    console.log(`reply: ${JSON.stringify(reply)}`);
                    resolve(reply)
                }
            })
        })
    }

    subcribe(channel, callback) {
        this.subcribeClient.subscribe(channel);
        this.subcribeClient.on("message", (subcribeChannel, message) => {
            if (channel === subcribeChannel) {
                callback(channel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService()