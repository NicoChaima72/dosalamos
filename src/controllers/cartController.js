const { Cart, Order, Product } = require("../models/index");

const controller = {};

controller.index = async (req, res) => {
	const user_id = req.user.id;
	const products = await Cart.findByUser(user_id);
	res.render("pages/cart.html", { title: "Hola", file: "cart", products });
};

controller.store = async (req, res) => {
	const product_id = req.params.product_id;
	const user_id = req.user.id;

	await Cart.create({ user_id, product_id });

	req.flash("success", "Producto agregado al carrito");
	res.redirect(`/products/${product_id}`);
};

controller.remove = async (req, res) => {
	const product_id = req.params.product_id;
	const user_id = req.user.id;

	await Cart.deleteProduct(product_id, user_id);

	req.flash("success", "Producto removido");
	res.redirect(`/cart`);
};

controller.shop = async (req, res) => {
	const { name, lastname, phone, direction } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}
	if (lastname.length === 0) {
		errors.push({ text: "El apellido es requerido" });
	}
	if (phone.length !== 9) {
		errors.push({ text: "El telefono tiene que tener 9 digitos" });
	}
	if (direction.length === 0) {
		errors.push({ text: "La direccion" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, lastname, phone, direction });
		return res.redirect("/cart");
	}

	const email = req.user.email;

	const products = await Cart.findByUser(req.user.id);
	const filterProducts = products.filter(
		(product) => product.status === 0 || product.stock === 0
	);

	if (filterProducts.length > 0) {
		req.flash(
			"error",
			"Algunos de tus productos están agotados o no disponibles, favor eliminalos de la lista"
		);
		return res.redirect(`/cart`);
	}

	let arrayId = [];
	products.forEach(async (product) => {
		arrayId.push(product.id);
		await Product.update(product.id, { stock: product.stock - 1 });
	});

	console.log({ array: arrayId });

	const order = {
		name,
		lastname,
		phone,
		direction,
		email,
		user_id: req.user.id,
		products: arrayId.toString(),
	};

	await Order.create(order);
	await Cart.deleteByUser(req.user.id);

	req.flash(
		"success",
		"Productos encargados, a la brevedad el soporte se comunicará contigo"
	);
	res.redirect(`/cart`);
};

module.exports = controller;
