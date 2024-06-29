'use strict'

const { resolve } = require('path')
const redis = require('redis')
const { promisify } = require('util')
const InventoryRepo = require('../repo/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

class RedisService {
    static acquireLock = async (productID, quantity, cartID) => {
        const key = 'lock_v2024_${productID}'
        const retryTime = 10
        const expireTime = 3000

        for (let index = 0; index < retryTime.length; index++) {
            // tạo một key, ai có thì được thanh toán
            const result = await setnxAsync(key, expireTime)
            console.log("result", result)

            if (result === 1) {
                // thao tác với inventory
                const isReservation = await InventoryRepo.reservationInventory({
                    productID, quantity, cartID
                })

                if (isReservation.modifiedCount > 0) {
                    await pexpire(key, expireTime)
                    return key
                }

                return null
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 50))
            }

        }
    }

    static releaseLock = async keyLock => {
        const delAsyncKey = promisify(redisClient.del).bind(redisClient)
        return await delAsyncKey
    }
}



module.exports = RedisService