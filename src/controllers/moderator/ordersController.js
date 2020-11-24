const { Product, Order } = require("../../models/index");

const controller = {};

controller.index = async (req, res) => {
	const orders = await Order.find();
	console.log(orders);
	res.render("moderator/orders/index.html", {
		title: "Lista pedidos",
		file: "moderator.orders",
		orders,
	});
};

controller.show = async (req, res) => {
	const order_id = req.params.order_id;
	const order = await Order.findById(order_id);
	const products = await Product.findByOrder(order.products.split(","));
	console.log(order);
	console.log(products);
	res.render("moderator/orders/show.html", {
		title: "Ver pedido",
		file: "moderator.orders",
		order,
		products,
	});
};

controller.update = async (req, res) => {
	const order_id = req.params.order_id;
	let { option } = req.body;

	if (option === "Entregado") option = 2;
	else option = 3;

	await Order.update(order_id, { state: option });

	req.flash("success", "Se ha actualizado la orden");
	res.redirect("/moderator/orders");
};

module.exports = controller;
