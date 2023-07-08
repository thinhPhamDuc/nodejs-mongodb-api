const express = require('express');
const Product = require('../models/productModel')
const {getProducts , getProductById, updateProduct , deleteProduct, insertProduct} = require('../controllers/productController');
const router = express.Router();

// save data to server
router.post('/', insertProduct)


// fetch all products
router.get('/', getProducts)

//find product by id
router.get('/:id', getProductById)

//update 
router.put('/:id', updateProduct)


//delete product
router.delete('/:id', deleteProduct)

module.exports = router
