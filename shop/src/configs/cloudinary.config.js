'use strict';

const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

const port = process.env.PORT;
const databaseUrl = process.env.DB_HOST;

console.log(`Server is running on port ${port}`);
console.log(`Database URL is ${databaseUrl}`);

// Log the Cloudinary configuration
console.log(cloudinary.config());

module.exports = {
    cloudinary
};
