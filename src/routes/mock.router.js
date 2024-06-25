const express = require("express");
const router = express.Router();
const Product = require("../dao/models/products.model.js");
const generarProductos = require("../utils/utils.js");

router.get('/mockingproducts', (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const product = generarProductos();
        products.push(product);
    }
    res.json(products);
});

module.exports = router;
