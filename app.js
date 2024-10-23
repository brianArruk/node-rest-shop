const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const proccess = require("./nodemon.json")
const productRoutes = require("./api/routes/products")
const ordersRoutes = require("./api/routes/orders")

mongoose.connect('mongodb+srv://brianarruk22:W3jnGEl0c6AYsqmz@cluster0.1ldfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const app = express()

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization")
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE")
        return res.status(200).json({})
    }
    next()
})

app.use("/products", productRoutes)
app.use("/orders", ordersRoutes)

app.use((req, res, next) => {
    const error = new Error("Route not found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app