const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

const Order = require("../models/order")
const Product = require("../models/product")

router.get("/getAllOrders", (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: 'products/getOrders?OrderId=' + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post("/", (req, res, next) => {

    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: 'products/getOrders?OrderId=' + doc._id
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
})

router.get("/getOrder", (req, res, next) => {
    Order.findById(req.query.orderId)
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
      res.status(200).json({
        order: order,
        request: {
            type: "GET",
            description: "Get all orders",
            url: 'localhost:3000/orders/getAllOrders'
        }
      })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})
// exemplo de rota utilizando async await ao inves do .then das promises
router.get("/getOrder2", async (req, res, next) => {
    try{
        const order = await Order.findById(req.query.orderId)
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
      res.status(200).json({
        order: order,
        request: {
            type: "GET",
            description: "Get all orders",
            url: 'localhost:3000/orders/getAllOrders'
        }
      })
    
        
    }catch (err) {
        res.status(500).json({ error: err });
    }
})

router.delete("/deleteOrder", (req, res, next) => {
    const id = req.query.orderId

    Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
        console.log("Id deleted", id)
        res.status(200).json({
            message: "Order deleted!",
            request: {
                type: "POST",
                url: 'localhost:3000/orders',
                body: {
                    productId: "ID",
                    quantity: "Number"
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router