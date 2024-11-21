const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

const Product = require("../models/product")
const product = require("../models/product")

router.get("/getAllProducts", (req, res, next) => {
    Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'localhost:3000/products/getProduct?productID=' + doc._id
                    }
                }
            })
        }
        
        // if (docs.length > 0) {
            res.status(200).json(response)
        // } else {
        //     res.status(404).json({message: "No product registered"})
        // }
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.doc,
                price: result.price,
                id: result._id,
                request: {
                    type: "GET",
                    url: 'localhost:3000/products/getProduct?productID=' + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// Example using query params instead of path parameters
// router.get("/", (req, res, next) => {
//     const id = req.query.productID

//     if (id == "special"){
//         res.status(200).json({
//             message: "You discovered the special ID",
//             id
//         })
//     } else {
//         res.status(200).json({
//             message: "You passed an ID",
//             id
//         })
//     }
// })

router.get("/getProduct", (req, res, next) => {
    const id = req.query.productID

    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("From database", doc)
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: "Get all products",
                    url: 'localhost:3000/products/getAllProducts'
                }
            })
        } else {
            res.status(404).json({message: "Not found"})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

// exemplo de rota utilizando async await ao inves do .then das promises
router.get("/getProduct2", async (req, res, next) => {
    const id = req.query.productID;

    try {
        const doc = await Product.findById(id).select('name price _id').exec();
        
        if (doc) {
            console.log("From database", doc);
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: "Get all products",
                    url: 'localhost:3000/products/getAllProducts'
                }
            });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.patch("/updateProduct", (req, res, next) => {
    const id = req.query.productID

    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => res.status(200).json({
        message: "Product updated!",
            request: {
                type: "GET",
                url: 'localhost:3000/products/getProduct?productID=' + result._id
            }
    }))
    .catch(err => res.status(500).json({ error: err}))

})

// exemplo de rota utilizando async await ao inves do .then das promises
router.patch("/updateProduct2", async (req, res, next) => {
    const id = req.query.productID;

    try {
        const result = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });

        res.status(200).json({
            message: "Product updated!",
            request: {
                type: "GET",
                url: 'localhost:3000/products/getProduct?productID=' + result._id
            }
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/deleteProduct", (req, res, next) => {
    const id = req.query.productID

    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        console.log("Id deleted", id)
        res.status(200).json({
            message: "Product deleted!",
            request: {
                type: "POST",
                url: 'localhost:3000/products/createProduct',
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

module.exports = router