const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/product", async (req, res) => {
	const products = await Product.find();

	res.render("pages/products.html", {
		title: "Productos",
		file: "product",
		products,
	});
});

router.get("/product/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render("pages/product.html", {
		title: product.name + " - ver producto",
		file: "",
		product,
	});
});

router.post("/product", (req, res) => {});

router.put("/product/:id", (req, res) => {});

router.delete("/product/:id", (req, res) => {});

module.exports = router;
