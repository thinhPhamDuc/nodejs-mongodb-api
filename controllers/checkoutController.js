const asyncHandler = require('express-async-handler')
const { Invoice } = require('../models/invoiceModel');
const Product = require('../models/productModel');
// user 
const checkout = asyncHandler(async (req, res) => {
    const token = req.header('authorization');
    const data = extractUserId(token);

    
    const invoice = await Invoice.create({ client_id: data.userId, product_id: req.body.product_id, product_variant_id: req.body.product_variant_id, stock: req.body.stock, })
    const productId = req.body.product_id;

    const filter = {
        "_id": productId,
        "variants._id": req.body.product_variant_id
    };

    // Define the update object
    const update = {
        $inc: {
            quantity: -req.body.stock,
            "variants.$.quantity": -req.body.stock
        }
    };

    // Update the product and variant quantities
    Product.findOneAndUpdate(filter, update, { new: true })
        .then(updatedProduct => {
            console.log("Product and variant quantities updated successfully:", updatedProduct);
            res.status(200).json(invoice)
        })
        .catch(error => {
            console.error("Error updating product and variant quantities:", error);
        });
})

const extractUserId = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

module.exports = {
    checkout
}