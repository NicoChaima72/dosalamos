const { Product } = require("../models/index");

const controller = {};

controller.home = async (req, res) => {
	const lastProducts = await Product.findLatests();
	res.render("pages/home.html", {
		title: "Inicio",
		file: "home",
		lastProducts,
	});
};

controller.about = async (req, res) => {
	res.render("pages/about.html", { title: "Nosotros", file: "about" });
};

module.exports = controller;
