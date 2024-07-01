// Mongo DB
const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}


const config = {dev}
const env = process.env.NODE_ENV || dev

module.exports = config[env]


