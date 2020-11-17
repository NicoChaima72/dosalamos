const express = require("express");
const pool = require("../database");
const router = express.Router();

router.get("/product", async (req, res) => {
	const products = await pool.query("SELECT * FROM products");

	res.render("pages/products.html", {
		title: "Productos",
		file: "product",
		products,
	});
});

router.get("/product/:id", async (req, res) => {
	const id = req.params.id;
	const product = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
	res.render("pages/product.html", {
		title: product.name + " - ver producto",
		file: "",
		product: product[0],
	});
});

module.exports = router;
