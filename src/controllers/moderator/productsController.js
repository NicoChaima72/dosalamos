const { Product } = require("../../models/index");

const controller = {};

controller.index = async (req, res) => {
	const products = await Product.find();
	res.render("moderator/products/index.html", {
		title: "Lista productos",
		file: "moderator.products",
		products,
	});
};

controller.create = async (req, res) => {
	res.render("moderator/products/create.html", {
		title: "Agregar producto",
		file: "moderator.products",
	});
};

controller.store = async (req, res) => {
	const { name, description, price, stock } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}
	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}
	if (price.length === 0) {
		errors.push({ text: "El precio es requerido" });
	}

	if (stock.length === 0) {
		errors.push({ text: "El stock es requerido" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, description, price, stock });
		res.redirect("/moderator/products/create");
	}

	const newProduct = { name, description, price, stock };
	await Product.create(newProduct);

	req.flash("success", "Producto agregado correctamente");
	res.redirect("/moderator/products");
};

controller.edit = async (req, res) => {
	const product_id = req.params.product_id;
	const product = await Product.findById(product_id);
	res.render("moderator/products/edit.html", {
		title: "Editar producto",
		file: "moderator.products",
		product,
	});
};

controller.update = async (req, res) => {
	const product_id = req.params.product_id;
	const { name, description, price } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}
	if (description.length === 0) {
		errors.push({ text: "La descripcion es requerida" });
	}
	if (price.length === 0) {
		errors.push({ text: "El precio es requerido" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, description, price });
		res.redirect(`/moderator/products/${id}/edit`);
	}

	params = { name, description, price };
	await Product.update(product_id, params);
	req.flash("success", "Producto actualizado correctamente");
	res.redirect("/moderator/products");
};

controller.destroy = async (req, res) => {
	const product_id = req.params.product_id;
	await Product.update(product_id, { state: 0 });
	req.flash("success", "Producto dado de baja");
	return res.redirect("/moderator/products");
};

controller.stock = async (req, res) => {
	const product_id = req.params.product_id;
	const { stock } = req.body;
	const errors = [];

	if (stock.length === 0) {
		errors.push({ text: "El stock es requerido" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		res.redirect(`/moderator/products`);
	}

	const params = { stock };

	await Product.update(product_id, params);
	const product = await Product.findById(product_id);

	req.flash("success", `Stock actualizado al producto "${product.name}"`);
	res.redirect("/moderator/products");
};

module.exports = controller;
