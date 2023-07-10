const mongoose = require('mongoose')

const productVariantModel = require('./productVariantModel').schema
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"],
            unique: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        variants: [productVariantModel]
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product',productSchema);

module.exports = Product;