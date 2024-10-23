const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

const Product = require("../models/product")

router.get("/getAllProducts", (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        // if (docs.length > 0) {
            res.status(200).json(docs)
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
            message: "Handling POST request to /products",
            createdProduct: result
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

    Product.findById(id).exec().then(doc => {
        console.log("From database", doc)
        if (doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({message: "Not found"})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.patch("/updateProduct", (req, res, next) => {
    const id = req.query.productID

    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err}))

})

router.delete("/deleteProduct", (req, res, next) => {
    const id = req.query.productID
    let idDeleted

    Product.findById(id).exec().then(doc => {
        if (doc) {
            idDeleted = doc._id
        } else {
            res.status(404).json({message: "Id Not found"})
        }
    }),

    Product.deleteOne(idDeleted)
    .exec()
    .then(doc => {
        console.log("Id deleted", idDeleted)
        res.status(200).json({
            message: "Id deleted " + idDeleted
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

// Another simple way to delete Product
router.delete("/deleteProduct2", (req, res, next) => {
    const id = req.query.productID

    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        console.log("Id deleted", id)
        res.status(200).json({message: "Id deleted " + id})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

module.exports = router