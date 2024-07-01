'use strict'

const mongoose = require('mongoose');

const connectionString = 'mongodb://root:123456@127.0.0.1:27017/shopDev?authSource=admin';

const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', testSchema);

describe('MongoDB Connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectionString);
    });

    afterAll(async () => {
        await connection.disconnect();
    });

    it('Should connect to MongoDB', () => {
        expect(mongoose.connection.readyState).toBe(1);  
    });
});
