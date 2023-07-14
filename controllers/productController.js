const Product = require('../models/productModel')
const FileChunks = require('../models/imageChunkModel')
const asyncHandler = require('express-async-handler')
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const url = process.env.MONOGO_URL
// upload image 
const storage = new GridFsStorage({
    url,
    file: (req, file) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return {
                bucketName: "photos",
                filename: `${Date.now()}_${file.originalname}`,
            };
        } else {
            return `${Date.now()}_${file.originalname}`;
        }
    },
});
const upload = multer({ storage });

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

// insert new product variant
const insertVariantProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const newVariant = {
            name: req.body.name,
            size: req.body.size,
            quantity: req.body.quantity,
            screen: req.body.screen,
            price: req.body.price
          };
          
        // Define the update object
        const update = {
            $push: {
                variants: newVariant
            }
        };
          
          // Update the product by adding the new variant
        Product.findOneAndUpdate({ "_id": id }, update, { new: true })
        .then(updatedProduct => {
            res.status(200).json(updatedProduct)
        })
        .catch(error => {
            console.error("Error adding variant:", error);
        });
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

// update product variants
const updateVariant = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const updateVariant = {
            "variants.$.name": req.body.name,
            "variants.$.size": req.body.size,
            "variants.$.quantity": req.body.quantity,
            "variants.$.screen": req.body.screen,
            "variants.$.price": req.body.price,
            updatedAt: new Date()
          };

        Product.findOneAndUpdate({ "variants._id": id }, updateVariant, { new: true })
        .then(updatedProduct => {
            console.log("Variant updated successfully:", updatedProduct);
        })
        .catch(error => {
            console.error("Error updating variant:", error);
        });

        const updatedProduct1 = await Product.find({ "variants._id": id });
        res.status(200).json(updatedProduct1)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

// delete product variants
const deleteVariant = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const filter = {
            "variants._id": id
        };

        // Define the update object
        const update = {
            $pull: {
                variants: { _id: id }
            }
        };

        // Update the product by deleting the variant
        Product.findOneAndUpdate(filter, update, { new: true })
            .then(updatedProduct => {
                res.status(200).json(updatedProduct)
            })
            .catch(error => {
                console.error("Error deleting variant:", error);
            });
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})
// upload images
const uploadImage = asyncHandler(async (req, res) => {
    upload.single("avatar")(req, res, async (err) => {
        if (err) {
            res.status(500);
            throw new Error(err.message);
        }
        const file = req.file;
        res.send({
            message: "Uploaded",
            id: file.id,
            name: file.filename,
            contentType: file.contentType,
        });
    });
});

const ObjectID = require('mongodb').ObjectId;

const getImage = asyncHandler(async (req, res) => {
    try {
      const fileId = req.params.id;
      const fileChunksArray = await FileChunks.find({ files_id: new ObjectID(fileId) });
  
      if (!fileChunksArray || fileChunksArray.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      const chunks = [];
      fileChunksArray.forEach((chunk) => {
        if (chunk.data) {
          chunks.push(chunk.data);
        }
      });
  
      if (chunks.length === 0) {
        return res.status(404).json({ message: 'Base64 data not found' });
      }
  
      const buffer = Buffer.concat(chunks);
      const base64Data = buffer.toString('base64');
  
      const image = {
        id: fileId,
        data: base64Data,
      };
  
      res.status(200).json(image);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
});

module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    insertProduct,
    uploadImage,
    getImage,
    updateVariant,
    deleteVariant,
    insertVariantProduct
}