const express = require('express')

const mongoose = require('mongoose')
const app = express()

const Product = require('./models/productModel')

app.use(express.json())

//router

app.get('/', (req, res) => {
    res.send('Welcome node api')
})


// save data to server
app.post('/product', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})


// fetch all products
app.get('/product', async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//find product by id
app.get('/product/:id', async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//update 
app.put('/product/:id', async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        if(!product) {
            return res.status(404).json({message: 'Can not find product with id ${id}'})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//delete product
app.delete('/product/:id', async (req, res) => {
    try {
        const {id} =req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product) {
            return res.status(404).json({message: 'Can not find product with id ${id}'})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.
connect('mongodb+srv://phamducthinhbeo:4chKCXNL4aRiAL4v@nodejs-api-booking.6yd0u4v.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(()=>{
    console.log('connection to MongoDB')
    app.listen(3000, () => {
        console.log("listening on 3000");
      });
}).catch((error)=>{
    console.log(err);
})