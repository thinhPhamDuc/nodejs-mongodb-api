const express = require('express');
const Product = require('../models/productModel')
const {getProducts , getProductById, updateProduct , deleteProduct, insertProduct, uploadImage,getImage,updateVariant , deleteVariant , insertVariantProduct } = require('../controllers/productController');
const router = express.Router();

// save data to server
router.post('/', insertProduct)
router.post('/:id', insertVariantProduct)

// fetch all products
router.get('/', getProducts)

//find product by id
router.get('/:id', getProductById)

//update 
router.put('/:id', updateProduct)

//delete product
router.delete('/:id', deleteProduct)

//update product variants
router.put('/variant/:id', updateVariant)
router.delete('/variant/:id', deleteVariant)

//upload image
router.post('/upload', uploadImage)
router.get('/image/:id', getImage)

module.exports = router
