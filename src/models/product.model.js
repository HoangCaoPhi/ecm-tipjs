'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_design: String,
    product_price: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, require: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: { type: String, required: true},
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacture: { type: String, required: true},
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
})



module.exports = {
    products: model(DOCUMENT_NAME, productSchema),
    clothes: model('Electronics', clothingSchema),
    electronics: model('Clothing', electronicSchema)
};