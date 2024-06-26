'use strict'

const mongoose = require('mongoose')
const {countConnect} = require("../helper/checkConnect")
const {db: {host, name, port, username, password}} = require('../configs/config')

const connectionString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
console.log(connectionString);
class Database {    
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {        
        if(true) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectionString)
        .then(_ => {
            countConnect()
        })
        .catch(err => console.log(`Error connect: ${err}`))
    }

    static getInstance() {
        if(!Database.instanse) {
            Database.instanse = new Database()
        }
        return Database.instanse;
    }
}

const instanseMongodb = Database.getInstance()
module.exports = instanseMongodb
