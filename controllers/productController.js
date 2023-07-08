const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')


// get all products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json(product)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})
// get a single product

const getProductById =  asyncHandler (async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

//update product

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        if(!product) {
            return res.status(404).json({message: 'Can not find product with id ${id}'})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})


//delete product
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product) {
            return res.status(404).json({message: 'Can not find product with id ${id}'})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

// insert product 
const insertProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    insertProduct
}