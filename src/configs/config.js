// Mongo DB
const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME
    }
}


const config = {dev}
const env = process.env.NODE_ENV || dev

module.exports = config[env]


