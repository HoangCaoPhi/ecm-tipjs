'use strict'

const { model, Schema } = require('mongoose');
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_design: String,
    product_description: String,
    product_price: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_slug: String,
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_rating_average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (value) => Math.round(value * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    is_draft: {type: Boolean, default: true, index: true, select: false},
    is_publish: {type: Boolean, default: false, index: true, select: false},

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// Add index
productSchema.index({product_name: 'text', product_description: 'text'})

// Pre handle data
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacture: { type: String, required: true },
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
})

const funitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'funitures',
    timestamps: true
})


module.exports = {
    products: model(DOCUMENT_NAME, productSchema),
    clothes: model('Electronics', clothingSchema),
    electronics: model('Clothing', electronicSchema),
    funiture: model('Funiture', funitureSchema)
};