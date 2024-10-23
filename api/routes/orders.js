const express = require("express")

const router = express.Router()

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Orders were fetched"
    })
})

router.post("/", (req, res, next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "Order was created",
        order: order
    })
})

router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "Order Details",
        orderID: req.params.orderId
    })
})

router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "Order deleted",
        orderID: req.params.orderId
    })
})


module.exports = router