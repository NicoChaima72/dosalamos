const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/products", [isAuthenticated, isAdmin], async (req, res) => {
	const products = await Product.find();

	res.render("admin/product/list.html", {
		title: "Lista productos",
		file: "admin.products",
		products: products,
	});
});

router.get(
	"/admin/products/create",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		res.render("admin/product/create.html", {
			title: "Agregar producto",
			file: "admin.products",
		});
	}
);

router.post("/admin/products", [isAuthenticated, isAdmin], async (req, res) => {
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
	const existProduct = await Product.findOne({ name });
	if (existProduct) {
		errors.push({ text: "El nombre ya está registrado" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, description, price });
		res.redirect("/admin/products/create");
	}

	const newProduct = new Product({ name, description, price });
	await newProduct.save();

	req.flash("success_msg", "Producto agregado correctamente");
	res.redirect("/admin/products");
});

router.get(
	"/admin/products/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {}
);

router.get(
	"/admin/products/:id/edit",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;
		const product = await Product.findById(id);
		res.render("admin/product/edit.html", {
			title: "Editar producto",
			file: "admin.products",
			product,
		});
	}
);

router.put(
	"/admin/products/:id",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		const id = req.params.id;
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
			res.redirect(`/admin/products/${id}/edit`);
		}

		Product.findByIdAndUpdate(
			id,
			{ name, description, price },
			{ new: true },
			(err, product) => {
				if (err) return res.status(400).json({ ok: false, err });

				req.flash("success_msg", "Producto actualizado correctamente");
				res.redirect("/admin/products");
			}
		);
	}
);

router.delete("/admin/products/:id", [isAuthenticated, isAdmin], (req, res) => {
	const id = req.params.id;

	res.redirect(`/admin/upload/${id}/delete`);
});

module.exports = router;
