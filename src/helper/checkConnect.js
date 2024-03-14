'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000;

// Đếm số lượng connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection: ${numConnection}`)
}

// Kiểm tra quá tải kết nối
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUse = process.memoryUsage().rss

        // Giả sử 1 core chịu được 5 connection
        const maxConnection = numCores * 5

        console.log(`Active connection: ${numConnection}`);
        console.log(`Memory use: ${memoryUse / 1024 / 1024} MB`);
        if (numConnection > maxConnection) {
            console.log("Connection overload")
        }
    }, _SECOND)
}

module.exports = { countConnect, checkOverload }