const { Product, Cart } = require("../models/index");

const controller = {};

controller.index = async (req, res) => {
	const products = await Product.find();

	res.render("pages/products.html", {
		title: "Productos",
		file: "product",
		products,
	});
};

controller.show = async (req, res) => {
	const product_id = req.params.product_id;
	const product = await Product.findById(product_id);
	let isAdded = false;
	if (req.user) {
		isAdded = await Cart.findProductByUser(product.id, req.user.id);
	}

	res.render("pages/product.html", {
		title: product.name + " - ver producto",
		file: "product",
		product,
		isAdded,
	});
};

controller.search = async (req, res) => {
	const search = req.query.s;
	const products = await Product.search(search);

	res.render("pages/search.html", {
		title: "Buscando productos",
		file: "product",
		products,
		search,
	});
};

module.exports = controller;
