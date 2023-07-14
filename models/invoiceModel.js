const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice', new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
    },
    product_variant_id: {
        type: String,
        required: true,
    },
    client_id: {
        type: String,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    }
}));

exports.Invoice = Invoice;