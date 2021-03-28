require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x1vlg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertMany(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((error, document) => {
                res.send(document)
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((error, document) => {
                res.send(document[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((error, document) => {
                res.send(document)
            })
    })

});



app.listen(port)