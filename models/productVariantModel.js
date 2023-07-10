const mongoose = require('mongoose')

const ProductVariantSchema = mongoose.Schema({
    name: String,
    size: String,
    quantity: Number,
    screen: String,
    price: Number,
});

const productVariant = mongoose.model('ProductVariant', ProductVariantSchema);

module.exports = productVariant;
